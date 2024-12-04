import { usePathname } from 'expo-router';
import { ReactNode, useEffect } from 'react';

import { AuthScreen, useAuthScreen } from '~/hooks/zustand/useAuthScreenStore';
const AuthScreenProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { setPostScreen } = useAuthScreen();

  useEffect(() => {
    if (pathname.includes('auth')) {
      const currentAuthScreen = pathname.split('/').filter(Boolean).pop() || '/';
      if (['sign-in', 'sign-up'].includes(currentAuthScreen)) {
        setPostScreen(currentAuthScreen as AuthScreen);
      }
    } else {
      setPostScreen('idle');
    }
  }, [pathname]);

  return <>{children}</>;
};

export default AuthScreenProvider;
