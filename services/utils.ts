import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { TokenType } from '~/types';

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';
export const FIRST_LAUNCH = 'firstLaunch';

export const getTokenAsync = async () => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  return token ? (JSON.parse(token) as TokenType) : null;
};

export const setTokenAsync = async (token: TokenType) => {
  await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(token));
};

export const removeTokenAsync = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const isFirstLaunchAsync = async () => {
  try {
    const firstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH);
    return firstLaunch === null;
  } catch {
    return false;
  }
};
