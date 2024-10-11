import '~/global.css';

import { Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';
import TrackPlayer from 'react-native-track-player';

import { AppStack } from '~/components/AppStack';
import { PortalHost } from '~/components/primitives/portal';
import { useSetupTrackPlayer } from '~/hooks/useSetupTrackPlayer';
import i18n from '~/i18n';
import { NAV_THEME } from '~/lib/constants';
import { registerBackgroundService } from '~/lib/services';
import AuthProvider from '~/providers/auth';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};

export { ErrorBoundary } from 'expo-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

TrackPlayer.registerPlaybackService(() => registerBackgroundService);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const handleTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);
  useSetupTrackPlayer({ onLoad: handleTrackPlayerLoaded });
  const [loaded] = useFonts({
    'Inter_18pt-Light': require('../assets/fonts/Inter_18pt-Light.ttf'),
    'Inter_18pt-ExtraLight': require('../assets/fonts/Inter_18pt-ExtraLight.ttf'),
    'Inter_18pt-Thin': require('../assets/fonts/Inter_18pt-Thin.ttf'),
    'Inter_18pt-Regular': require('../assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter_18pt-Medium': require('../assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter_18pt-SemiBold': require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
    'Inter_18pt-Bold': require('../assets/fonts/Inter_18pt-Bold.ttf'),
    'Inter_18pt-ExtraBold': require('../assets/fonts/Inter_18pt-ExtraBold.ttf'),
    'Inter_18pt-Black': require('../assets/fonts/Inter_18pt-Black.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <ThemeProvider value={LIGHT_THEME}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            {/* TODO: create a hook and component to dynamically change the style of status bar for each screen */}
            <StatusBar style={'light'} />
            <AppStack />
            <Toast />
            <PortalHost />
          </AuthProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
