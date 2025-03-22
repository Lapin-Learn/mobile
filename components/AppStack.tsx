import { useFonts } from 'expo-font';
import { router, SplashScreen, Stack } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';

import { useAuth } from '~/hooks/zustand';

import { AppStateHandler } from './AppStateHandler';

export const AppStack = () => {
  const { status } = useAuth();
  const [loaded] = useFonts({
    'Inter-Light': require('../assets/fonts/Inter_18pt-Light.ttf'),
    'Inter-ExtraLight': require('../assets/fonts/Inter_18pt-ExtraLight.ttf'),
    'Inter-Thin': require('../assets/fonts/Inter_18pt-Thin.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter_18pt-Bold.ttf'),
    'Inter-ExtraBold': require('../assets/fonts/Inter_18pt-ExtraBold.ttf'),
    'Inter-Black': require('../assets/fonts/Inter_18pt-Black.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (loaded && status !== 'idle') {
      SplashScreen.hideAsync();
    }
  }, [loaded, status]);

  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (loaded && status !== 'idle' && isMounted) {
      SplashScreen.hideAsync();

      if (status === 'isFirstLaunch') {
        router.replace('/on-boarding');
      }
    }
  }, [loaded, status, isMounted]);

  if (!loaded || status === 'idle') {
    return null;
  }

  return (
    <>
      <AppStateHandler />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        <Stack.Screen name='on-boarding' />
        <Stack.Screen name='update-profile' />
        <Stack.Screen name='auth' options={{ animation: 'fade', animationTypeForReplace: 'push' }} />
        <Stack.Screen name='(tabs)' options={{ animation: 'fade', animationTypeForReplace: 'push' }} />
        <Stack.Screen name='edit-profile' />
        <Stack.Screen name='firebaseauth' />
        <Stack.Screen name='exercise' />
        <Stack.Screen name='lesson' />
        <Stack.Screen name='items' />
        <Stack.Screen name='streak' />
      </Stack>
    </>
  );
};
