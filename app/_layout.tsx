import '~/global.css';

import { Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';
import TrackPlayer from 'react-native-track-player';

import { AppStack } from '~/components/navigation/AppStack';
import i18n from '~/i18n';
import { NAV_THEME } from '~/lib/constants';
import { TrackPlayerSetup } from '~/lib/trackPlayer';
import AuthProvider from '~/providers/auth';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};

export { ErrorBoundary } from 'expo-router';

const queryClient = new QueryClient();

TrackPlayer.registerPlaybackService(() => async () => TrackPlayerSetup());

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={LIGHT_THEME}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <StatusBar style={'light'} />
            <AppStack />
            <Toast />
          </AuthProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
