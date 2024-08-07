import { createStore, useStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import { getTokenAsync, removeTokenAsync, setTokenAsync } from '~/services/utils';
import { TokenType } from '~/types';

type AuthStatus = 'idle' | 'signOut' | 'signIn';

type AuthState = {
  token: TokenType | null;
  status: AuthStatus;
  signIn: (data: TokenType) => void;
  signOut: () => void;
  hydrate: () => void;
};

const authStore = createStore<AuthState>()((set, get) => ({
  token: null,
  status: 'idle',
  signIn: (data) => {
    set({ token: data, status: 'signIn' });
    setTokenAsync(data);
  },
  signOut: () => {
    set({ token: null, status: 'signOut' });
    removeTokenAsync();
  },
  // TODO: Delete setTimeOut() when the app is ready to be deployed
  hydrate: async () => {
    try {
      const currentToken = await getTokenAsync();
      setTimeout(() => {
        if (currentToken !== null) {
          get().signIn(currentToken);
        } else {
          get().signOut();
        }
      }, 1000);
    } catch (error) {
      console.error('Error hydrating token', error);
    }
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

export default function useAuthStore<U>(selector: Params<U>[1], equalityFn?: Params<U>[2]) {
  return useStoreWithEqualityFn(authStore, selector, equalityFn);
}

export const useAuth = () => {
  const token = useAuthStore(tokenSelector);
  const status = useAuthStore(statusSelector);

  return { token, status };
};

// Hooks
export const hydrate = () => authStore.getState().hydrate();
export const signIn = (token: TokenType) => authStore.getState().signIn(token);
export const signOut = () => authStore.getState().signOut();
