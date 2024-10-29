import { PropsWithChildren, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { requestPermission } from '../utils/permissions';

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [appState, setAppState] = useState(AppState.currentState);

  const checkNotificationPermission = async () => {
    await requestPermission();
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      checkNotificationPermission();
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    checkNotificationPermission().then(() => {
      console.log('Notification permission granted');
    });
  }, []);

  return <>{children}</>;
};

export default NotificationProvider;
