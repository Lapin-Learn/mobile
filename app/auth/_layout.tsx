import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';

import { useAuth } from '~/hooks/zustand';

const AuthLayout = () => {
  const { status } = useAuth();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  return (
    <Stack>
      <Stack.Screen name='sign-in' options={{ headerShown: false }} />
      <Stack.Screen name='(sign-up)' options={{ headerShown: false }} />
      <Stack.Screen name='(forgot-password)' options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
