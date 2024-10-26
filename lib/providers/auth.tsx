import { router } from 'expo-router';
import { ReactNode, useEffect } from 'react';

import { useAuth } from '~/hooks/zustand';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { status, hydrate } = useAuth();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (status === 'isFirstLaunch') {
      router.replace('/on-boarding');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return <>{children}</>;
};

export default AuthProvider;
