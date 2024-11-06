import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin, isCancelledResponse, SignInResponse } from '@react-native-google-signin/google-signin';

import { ProviderNameEnum } from '~/lib/enums';

import api from '../httpRequests';
import { removeTokenAsync, setTokenAsync } from '../utils';

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_FIREBASE_GOOGLE_CLIENT_ID;
GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
});

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
type VerifyParams = { email: string; otp: string };

export const signIn = async (params: SignInParams) => {
  const data = await api.post<AuthInfo>('auth/signin', { body: params });
  return data;
};

export const signUp = async (params: SignUpParams) => {
  const data = await api.post<AuthInfo>('auth/signup', { body: params });
  return data;
};

export const signOut = async () => {
  await removeTokenAsync();

  const isSignedIn = (await GoogleSignin.getCurrentUser()) !== null;
  isSignedIn && (await GoogleSignin.revokeAccess());
};

export const verify = async (params: VerifyParams) => {
  const data = await api.post<AuthInfo>('auth/otp', { body: params });
  return data;
};

export const forgotPassword = async (params: Pick<AccountIdentifier, 'email'>) => {
  await api.get<AuthInfo>(`auth/otp?email=${params.email}`);
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

export const signInWithProvider = async (provider: ProviderNameEnum) => {
  let credential: FirebaseAuthTypes.AuthCredential | undefined;
  if (provider === ProviderNameEnum.GOOGLE) {
    credential = await signInWithGoogle();
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
