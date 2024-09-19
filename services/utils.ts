import * as SecureStore from 'expo-secure-store';

import { TokenType } from '~/types';

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

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

export const convertSecondsToMinutes = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
};

export const getDuration = (startTime: Date): number => {
  const endTime = new Date();
  return Math.round(Math.abs(endTime.getTime() - startTime.getTime()) / 1000);
};
