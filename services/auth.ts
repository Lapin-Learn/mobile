import api from './httpRequests';

export type Session = {
  user?: AuthInfo;
};

export type AuthInfo = {
  token_type: string;
  accessToken: string;
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

export const signOut = async () => {
  // return await apiAuth.post('auth/sign-out');
  return;
};

// export const getAuthUser = async () => {
//   const data = await api.get<AuthUser>('auth/profile');
//   SecureStore.setItem(localStorageUserKey, JSON.stringify(data));
//   return data;
// };

export const refreshToken = async (refreshToken: string) => {
  const data = await api.post<AuthInfo>('auth/refresh', {
    body: { refreshToken },
  });
  return data;
};
