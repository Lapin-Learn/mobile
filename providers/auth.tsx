import { router } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { useSignOut } from '~/hooks/react-query/useAuth';
import { AuthProps, hydrate, useAuth } from '~/hooks/zustand';
import { getFirstLaunchAsync } from '~/services';

async function checkIfFirstLaunch() {
  try {
    const hasFirstLaunched = await getFirstLaunchAsync();
    return hasFirstLaunched;
  } catch {
    return false;
  }
}

const AuthContext = createContext<AuthProps>({ token: { token_type: null, accessToken: null }, status: 'idle' });

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { token, status } = useAuth();
  const signOut = useSignOut();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  const contextValue = useMemo(
    () => ({
      token,
      status,
    }),
    [token, status]
  );

  useEffect(() => {
    const firstLaunch = async () => {
      setIsFirstLaunch(await checkIfFirstLaunch());
    };
    firstLaunch();
  }, []);

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (status === 'signOut' && isFirstLaunch === false) {
      signOut.mutate();
    }
    if (isFirstLaunch === true) {
      router.push('/on-boarding');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isFirstLaunch]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
