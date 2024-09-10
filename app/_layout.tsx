import '~/global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Appearance, Platform } from 'react-native';
import Toast from 'react-native-toast-message';

import { AppStack } from '~/components/navigation/AppStack';
import i18n from '~/i18n';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }
      if (!theme) {
        AsyncStorage.setItem('theme', colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'light' : 'light';
      if (colorTheme !== colorScheme) {
        Appearance.setColorScheme('light');

        setIsColorSchemeLoaded(true);
        return;
      }
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, [colorScheme]);

  if (!isColorSchemeLoaded) {
    // return null; // fallback to whatever the splash screen is doing by default (1)
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
          <AppStack />
          <Toast />
        </I18nextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
