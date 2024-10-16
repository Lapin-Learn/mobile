import { router, usePathname } from 'expo-router';
import { ReactNode, useEffect } from 'react';

import { useSignOut } from '~/hooks/react-query/useAuth';
import { hydrate, useAuth } from '~/hooks/zustand';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { status } = useAuth();
  const signOut = useSignOut();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (status === 'isFirstLaunch') {
      router.replace('/on-boarding');
    } else if (status === 'signOut') {
      if (pathname !== '/auth/sign-in') {
        signOut.mutate();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return <>{children}</>;
};

export default AuthProvider;
