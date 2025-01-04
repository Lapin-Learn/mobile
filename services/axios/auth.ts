import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin, isCancelledResponse, SignInResponse } from '@react-native-google-signin/google-signin';
import {
  AppleAuthenticationCredential,
  AppleAuthenticationScope,
  AppleAuthenticationSignInOptions,
  signInAsync,
} from 'expo-apple-authentication';

import { AuthActionEnum, ProviderNameEnum } from '~/lib/enums';

import api from '../httpRequests';
import { removeTokenAsync, setTokenAsync } from '../utils';
import { deleteFcmToken } from './notification';

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_FIREBASE_GOOGLE_CLIENT_ID;
GoogleSignin.configure({
  scopes: ['email', 'profile', 'openid', 'https://www.googleapis.com/auth/firebase.messaging'],
  webClientId: GOOGLE_CLIENT_ID,
  offlineAccess: true, // DO NOT REMOVE THIS LINE
});

const AppleSignInOptions: AppleAuthenticationSignInOptions = {
  requestedScopes: [AppleAuthenticationScope.FULL_NAME, AppleAuthenticationScope.EMAIL],
};

export type Session = {
  user?: AuthInfo;
};

export type AuthInfo = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = { username: string; phone: string };

export type AccountIdentifier = {
  password: string;
  username: string;
  email: string;
  role: string;
};

type SignInParams = Pick<AccountIdentifier, 'email' | 'password'>;
type SignUpParams = Pick<AccountIdentifier, 'email' | 'password'>;
type VerifyParams = { email: string; otp: string; action: AuthActionEnum };

export const signIn = async (params: SignInParams) => {
  const data = await api.post<AuthInfo>('auth/signin', { body: params });
  return data;
};

export const signUp = async (params: SignUpParams) => {
  const data = await api.post<AuthInfo>('auth/signup', { body: params });
  return data;
};

export const signOut = async () => {
  await deleteFcmToken();
  await removeTokenAsync();

  const isSignedIn = (await GoogleSignin.getCurrentUser()) !== null;
  isSignedIn && (await GoogleSignin.revokeAccess());
};

export const verify = async (params: VerifyParams) => {
  const data = await api.post<AuthInfo>('auth/otp', { body: params });
  return data;
};

export const forgotPassword = async (params: Omit<VerifyParams, 'otp'>) => {
  await api.get<AuthInfo>(`auth/otp?email=${params.email}&action=${params.action}`);
};

export const resetPassword = async (params: { newPassword: string }) => {
  await api.post<AuthInfo>('auth/password-update', { body: params });
};

export const refreshToken = async (refreshToken: string) => {
  const data = await api.post<AuthInfo>('auth/refresh', {
    body: { refreshToken },
  });
  await setTokenAsync(data);
  return data;
};

export const createProfile = async (token: string) => {
  return await api.post('auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const signInWithProvider = async (provider: ProviderNameEnum) => {
  let credential: FirebaseAuthTypes.AuthCredential | undefined;
  switch (provider) {
    case ProviderNameEnum.APPLE:
      credential = await signInWithApple();
      break;
    case ProviderNameEnum.FACEBOOK:
    case ProviderNameEnum.GOOGLE:
      credential = await signInWithGoogle();
      break;
  }

  if (credential) {
    return await api.post<AuthInfo>('auth/provider', {
      body: { credential: credential?.token, provider: credential?.providerId },
    });
  }
  return undefined;
};

export const signInWithGoogle = async () => {
  const userInfo: SignInResponse = await GoogleSignin.signIn();
  if (!isCancelledResponse(userInfo)) {
    return auth.GoogleAuthProvider.credential(userInfo.data?.idToken || '');
  }
  return undefined;
};

export const signInWithApple = async () => {
  const appleAuthRequestResponse: AppleAuthenticationCredential = await signInAsync(AppleSignInOptions);
  if (appleAuthRequestResponse.authorizationCode && appleAuthRequestResponse.identityToken) {
    return auth.AppleAuthProvider.credential(
      appleAuthRequestResponse.identityToken,
      appleAuthRequestResponse.authorizationCode
    );
  }
};
