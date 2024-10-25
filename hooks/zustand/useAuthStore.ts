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

    // const currentToken = await getTokenAsync();
    // console.log('hydrate successfully', currentToken?.accessToken);
    // if (currentToken && currentToken.accessToken && currentToken.refreshToken) {
    //   set({ status: 'signIn' });
    // } else {
    //   set({ status: 'signOut' });
    //   router.replace('/auth/sign-in');
    //   signOut();
    // }
  },
}));
