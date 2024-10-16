import { jwtDecode } from 'jwt-decode';
import { createStore, useStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import { getTokenAsync, isFirstLaunchAsync, removeTokenAsync, setTokenAsync } from '~/services/utils';
import { TokenType } from '~/types';

export type AuthStatus = 'idle' | 'signOut' | 'signIn' | 'isFirstLaunch';

export type AuthProps = {
  token: TokenType | null;
  status: AuthStatus;
};

type AuthState = {
  token: AuthProps['token'];
  status: AuthProps['status'];
  signIn: (data: TokenType) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => void;
  checkTokenExpiration: () => void;
  scheduleTokenCheck: (token: TokenType) => void;
};

type DecodedToken = {
  userId: string;
  role: string;
  iat: number;
  exp: number;
};

const authStore = createStore<AuthState>()((set, get) => ({
  token: null,
  status: 'idle',
  signIn: async (data) => {
    set({ token: data, status: 'signIn' });
    await setTokenAsync(data);
    get().scheduleTokenCheck(data);
  },
  signOut: async () => {
    set({ token: null, status: 'signOut' });
    await removeTokenAsync();
  },
  hydrate: async () => {
    try {
      const hasFirstLaunched = await isFirstLaunchAsync();
      if (hasFirstLaunched) {
        set({ status: 'isFirstLaunch', token: null });
        return;
      }

      const currentToken = await getTokenAsync();
      if (currentToken !== null) {
        get().signIn(currentToken);
      } else {
        get().signOut();
      }
    } catch (error) {
      console.error('Error hydrating token', error);
    }
  },
  checkTokenExpiration: () => {
    const { token, signOut } = get();
    if (token) {
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token.accessToken || '');
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        signOut();
      } else {
        const timeout = (decodedToken.exp - currentTime) * 1000;
        setTimeout(() => get().checkTokenExpiration(), timeout);
      }
    }
  },
  scheduleTokenCheck: (token: TokenType) => {
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token.accessToken || '');
    const currentTime = Date.now() / 1000;
    const timeout = (decodedToken.exp - currentTime) * 1000;
    setTimeout(() => get().checkTokenExpiration(), timeout);
  },
}));

export type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;

type Params<U> = Parameters<typeof useStore<typeof authStore, U>>;

const tokenSelector = (state: ExtractState<typeof authStore>) => state.token;
const statusSelector = (state: ExtractState<typeof authStore>) => state.status;

const useAuthStore = <U>(selector: Params<U>[1], equalityFn?: Params<U>[2]) => {
  return useStoreWithEqualityFn(authStore, selector, equalityFn);
};

export const useAuth = () => {
  const token = useAuthStore(tokenSelector);
  const status = useAuthStore(statusSelector);

  return { token, status };
};

// Hooks
export const hydrate = () => authStore.getState().hydrate();
export const signIn = (token: TokenType) => authStore.getState().signIn(token);
export const signOut = () => authStore.getState().signOut();
