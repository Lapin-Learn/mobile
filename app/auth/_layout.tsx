import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';

import { useAuth } from '~/hooks/zustand';
import { crashlytics } from '~/lib/services';

const AuthLayout = () => {
  const { status } = useAuth();

  const hideSplash = useCallback(async () => {
    if (status !== 'idle') {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        crashlytics.recordError(error as Error);
      }
    }
  }, [status]);

  useEffect(() => {
    const timer = setTimeout(hideSplash, 500);
    return () => clearTimeout(timer);
  }, [hideSplash]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 200,
      }}>
      <Stack.Screen name='sign-in' />
      <Stack.Screen name='(sign-up)' />
      <Stack.Screen name='(forgot-password)' />
    </Stack>
  );
};

export default AuthLayout;
