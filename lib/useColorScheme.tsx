import { useColorScheme as useNativewindColorScheme } from 'nativewind';

export function useColorScheme() {
  const { colorScheme, toggleColorScheme } = useNativewindColorScheme();
  return {
    colorScheme: colorScheme ?? 'light',
    isDarkColorScheme: colorScheme === 'dark',
    toggleColorScheme,
  };
}
