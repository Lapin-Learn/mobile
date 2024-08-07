import { SplashScreen, Stack } from 'expo-router';
import { useCallback, useEffect } from 'react';

import { useAuth } from '~/hooks/zustand';

export default function Layout() {
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

  //   if (status === 'signOut') {
  //     return <Redirect href='/sign-in' />;
  //   }

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
    </Stack>
  );
}
