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
import { AnalyticsProvider, AuthProvider, CrashlyticsProvider, NotificationProvider } from '~/lib/providers';
import AuthScreenProvider from '~/lib/providers/authScreen';
import { analytics, crashlytics, registerBackgroundService } from '~/lib/services';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};

// TODO: wrap ErrorBoundary with a custom error boundary component
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

const RootLayout = () => {
  // Hide splash screen when TrackPlayer is loaded
  const handleTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useSetupTrackPlayer({ onLoad: handleTrackPlayerLoaded });

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

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  if (__DEV__) {
    crashlytics.setCrashlyticsCollectionEnabled(true);
    analytics.setAnalyticsCollectionEnabled(true);
  } else {
    // TODO: set up crashlytics and analytics for production
  }

  return (
    <ThemeProvider value={LIGHT_THEME}>
      <QueryClientProvider client={queryClient}>
        <AnalyticsProvider>
          <CrashlyticsProvider>
            <I18nextProvider i18n={i18n}>
              <AuthScreenProvider>
                <AuthProvider>
                  <NotificationProvider>
                    {/* TODO: create a hook and component to dynamically change the style of status bar for each screen */}
                    <StatusBar style='light' />
                    <AppStack />
                    <Toast />
                    <PortalHost />
                  </NotificationProvider>
                </AuthProvider>
              </AuthScreenProvider>
            </I18nextProvider>
          </CrashlyticsProvider>
        </AnalyticsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
