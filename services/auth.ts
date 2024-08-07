import { apiAuth } from './httpRequests';

export type Session = {
  user?: AuthInfo;
};

export type AuthInfo = {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
};

export type AuthUser = { username: string; phone: string };

export type AccountIdentifier = {
  password: string;
  username: string;
  email: string;
  role: string;
};

type SignInParams = Pick<AccountIdentifier, 'email' | 'password'>;
type SignUpParams = AccountIdentifier;
type VerifyParams = { email: string; code: string };
type ForgotPasswordParams = { email: string };
type ResetPasswordParams = { email: string; password: string };

export const signIn = async (params: SignInParams) => {
  // const data = await apiAuth.post<AuthInfo>('auth/sign-in', { body: params });
  const data = {
    access_token: 'mock',
    refresh_token: 'mock',
    token_type: 'mock',
    expires_in: 0,
  };
  return data;
};

export const signUp = async (params: SignUpParams) => {
  // return await apiAuth.post<AuthInfo>('auth/sign-up', { body: params });
  const data = {
    access_token: 'mock',
    refresh_token: 'mock',
    token_type: 'mock',
    expires_in: 0,
  };
  return data;
};

export const verify = async (params: VerifyParams) => {
  // return await apiAuth.post<AuthInfo>('auth/verify', { body: params });
  const data = {
    access_token: 'mock',
    refresh_token: 'mock',
    token_type: 'mock',
    expires_in: 0,
  };
  return data;
};

export const forgotPassword = async (params: ForgotPasswordParams) => {
  // return await apiAuth.post<AuthInfo>('auth/forgot-password', { body: params });
  const data = {
    access_token: 'mock',
    refresh_token: 'mock',
    token_type: 'mock',
    expires_in: 0,
  };
  return data;
};

export const resetPassword = async (params: ResetPasswordParams) => {
  // return await apiAuth.post<AuthInfo>('auth/reset-password', { body: params });
  const data = {
    access_token: 'mock',
    refresh_token: 'mock',
    token_type: 'mock',
    expires_in: 0,
  };
  return data;
};

// export const getAuthUser = async () => {
//   const data = await api.get<AuthUser>('auth/profile');
//   SecureStore.setItem(localStorageUserKey, JSON.stringify(data));
//   return data;
// };

export const refreshToken = async (refreshToken: string) => {
  const data = await apiAuth.post<AuthInfo>('auth/refresh', {
    body: { refreshToken },
  });
  return data;
};
