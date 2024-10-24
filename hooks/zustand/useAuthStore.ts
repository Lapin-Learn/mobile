import { createStore, useStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import { signOut } from '~/services';
import { getTokenAsync, isFirstLaunchAsync } from '~/services/utils';
import { TokenType } from '~/types';

export type AuthStatus = 'idle' | 'signOut' | 'signIn' | 'isFirstLaunch';

export type AuthProps = {
  token: TokenType | null;
  status: AuthStatus;
};

type AuthState = {
  token: AuthProps['token'];
  status: AuthProps['status'];
  hydrate: () => Promise<void>;
};

const authStore = createStore<AuthState>()((set) => ({
  token: null,
  status: 'idle' as AuthStatus,
  hydrate: async () => {
    try {
      const hasFirstLaunched = await isFirstLaunchAsync();
      if (hasFirstLaunched) {
        set({ status: 'isFirstLaunch', token: null });
        return;
      }

      const currentToken = await getTokenAsync();
      console.log('hydrate successfully', currentToken?.accessToken);
      if (currentToken !== null) {
        set({ status: 'signIn' });
      } else {
        set({ status: 'signOut' });
        signOut();
      }
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
