import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';

import { useAccountIdentifier } from '~/hooks/react-query/useUser';

export const AppStack = () => {
  const { isSuccess, isError, data: account } = useAccountIdentifier();

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

  useEffect(() => {
    if (loaded && (isSuccess || isError)) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isSuccess, isError]);

  if (!loaded) {
    return null;
  }

  if (isError || (isSuccess && !account)) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='auth' />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName='auth'>
      <Stack.Screen name='index' />
      <Stack.Screen name='on-boarding' />
      <Stack.Screen name='update-profile' />
      <Stack.Screen name='auth' />
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='edit-profile' />
      <Stack.Screen name='firebaseauth' />
      <Stack.Screen name='exercise' />
      <Stack.Screen name='random' />
      <Stack.Screen name='lesson' />
      <Stack.Screen name='items' />
      <Stack.Screen name='streak' />
    </Stack>
  );
};
