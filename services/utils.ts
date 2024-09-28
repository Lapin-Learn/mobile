import * as SecureStore from 'expo-secure-store';

import { TokenType } from '~/types';

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';
export const FIRST_LAUNCH = 'firstLaunch';

export const getTokenAsync = async (): Promise<TokenType | null> => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  return token ? (JSON.parse(token) as TokenType) : null;
};

export const setTokenAsync = async (token: TokenType): Promise<void> => {
  SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(token));
};

export const removeTokenAsync = async (): Promise<void> => {
  SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const getFirstLaunchAsync = async (): Promise<boolean> => {
  const firstLaunch = await SecureStore.getItemAsync(FIRST_LAUNCH);
  return firstLaunch === null;
};

export const setFirstLaunchAsync = async (): Promise<void> => {
  SecureStore.setItemAsync(FIRST_LAUNCH, 'true');
};

export const removeFirstLaunchAsync = async (): Promise<void> => {
  SecureStore.deleteItemAsync(FIRST_LAUNCH);
};
