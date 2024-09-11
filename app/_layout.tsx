import '~/global.css';

import { Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { AppStack } from '~/components/navigation/AppStack';
import i18n from '~/i18n';
import { NAV_THEME } from '~/lib/constants';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};

export { ErrorBoundary } from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ThemeProvider value={LIGHT_THEME}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <StatusBar style={'light'} />
          <AppStack />
          <Toast />
        </I18nextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
