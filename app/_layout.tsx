import '~/global.css';

import { Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { AppStack } from '~/components/AppStack';
import { BreakpointView } from '~/components/molecules/Breakpoint';
import { PortalHost } from '~/components/primitives/portal';
import i18n from '~/i18n';
import { NAV_THEME } from '~/lib/constants';
import { AnalyticsProvider, AuthProvider, CrashlyticsProvider, NotificationProvider } from '~/lib/providers';
import AuthScreenProvider from '~/lib/providers/authScreen';
import { analytics, crashlytics } from '~/lib/services';

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

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
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
                    <BreakpointView>
                      <AppStack />
                    </BreakpointView>
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
