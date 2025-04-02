import { ReactNode, useEffect } from 'react';

import { useAuth } from '~/hooks/zustand';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { hydrate } = useAuth();
  useEffect(() => {
    hydrate();
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
