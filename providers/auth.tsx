import { router } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';

import { useSignOut } from '~/hooks/react-query/useAuth';
import { hydrate, useAuth } from '~/hooks/zustand';
import { isFirstLaunchAsync } from '~/services';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { status } = useAuth();
  const signOut = useSignOut();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);

  const firstLaunch = async () => {
    const hasFirstLaunched = await isFirstLaunchAsync();
    setIsFirstLaunch(hasFirstLaunched);
  };

  useEffect(() => {
    firstLaunch();
    hydrate();
  }, []);

  useEffect(() => {
    if (status === 'signOut') {
      if (isFirstLaunch) {
        router.push('/on-boarding');
      } else {
        signOut.mutate();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isFirstLaunch]);

  return <>{children}</>;
};

export default AuthProvider;
