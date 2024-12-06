import AsyncStorage from '@react-native-async-storage/async-storage';

import { TokenType } from '~/types';

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';
export const FIRST_LAUNCH = 'firstLaunch';

export const getTokenAsync = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return token ? (JSON.parse(token) as TokenType) : null;
};

export const setTokenAsync = async (token: TokenType) => {
  await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(token));
};

export const removeTokenAsync = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const isFirstLaunchAsync = async () => {
  try {
    const firstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH);
    return firstLaunch === null;
  } catch {
    return false;
  }
};
