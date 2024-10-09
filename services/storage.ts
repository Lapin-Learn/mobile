import * as SecureStore from 'expo-secure-store';

import { AuthInfo, AuthUser } from './axios/auth';

export const localStorageTokenKey = 'auth_client_token';
export const localStorageUserKey = 'auth_client_user';

export const getAuthValueFromStorage = () => {
  return SecureStore.getItem(localStorageTokenKey)
    ? (JSON.parse(SecureStore.getItem(localStorageTokenKey) ?? '') as AuthInfo)
    : null;
};

export const getUserValueFromStorage = () => {
  return SecureStore.getItem(localStorageUserKey)
    ? (JSON.parse(SecureStore.getItem(localStorageUserKey) ?? '') as AuthUser)
    : null;
};
