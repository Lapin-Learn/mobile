import { create } from 'zustand';

import { isFirstLaunchAsync } from '~/services/utils';

export type AuthStatus = 'idle' | 'signOut' | 'signIn' | 'isFirstLaunch';

type AuthState = {
  status: AuthStatus;
};

type AuthAction = {
  hydrate: () => Promise<void>;
};

export const useAuth = create<AuthState & AuthAction>((set) => ({
  status: 'idle' as AuthStatus,
  hydrate: async () => {
    isFirstLaunchAsync()
      .then((hasFirstLaunched) => {
        if (hasFirstLaunched) {
          set({ status: 'isFirstLaunch' });
        } else set({ status: 'signIn' });
      })
      .catch((error) => {
        console.error('Error hydrating token', error);
      });
  },
}));
