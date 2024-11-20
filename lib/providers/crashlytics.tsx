import { usePathname } from 'expo-router';
import { ReactNode, useEffect } from 'react';

import { crashlytics } from '../services';
const CrashlyticsProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    crashlytics.setAttribute('screen_class', (pathname === '/' ? 'home' : pathname).replace('/', ''));
  }, [pathname]);

  return <>{children}</>;
};

export default CrashlyticsProvider;
