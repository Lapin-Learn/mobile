import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';

import { useSignOut } from '~/hooks/react-query/useAuth';
import { AuthProps, hydrate, useAuth } from '~/hooks/zustand';

const AuthContext = createContext<AuthProps>({ token: { token_type: null, accessToken: null }, status: 'idle' });

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { token, status } = useAuth();
  const signOut = useSignOut();
  const contextValue = useMemo(
    () => ({
      token,
      status,
    }),
    [token, status]
  );

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (status === 'signOut') {
      signOut.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
