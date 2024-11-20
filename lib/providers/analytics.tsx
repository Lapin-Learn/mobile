import { usePathname } from 'expo-router';
import { ReactNode, useEffect } from 'react';

import { analytics } from '../services';
const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    analytics.logScreenView({
      screen_class: pathname,
      screen_name: (pathname === '/' ? 'home' : pathname).replace('/', ''),
    });
  }, [pathname]);

  return <>{children}</>;
};

export default AnalyticsProvider;
