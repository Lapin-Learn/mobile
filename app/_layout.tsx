import '~/global.css';

import { Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';
import TrackPlayer from 'react-native-track-player';

import { AppStack } from '~/components/navigation/AppStack';
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

const queryClient = new QueryClient();

TrackPlayer.registerPlaybackService(() => registerBackgroundService);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const handleTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);
  useSetupTrackPlayer({ onLoad: handleTrackPlayerLoaded });

  return (
    <ThemeProvider value={LIGHT_THEME}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
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
