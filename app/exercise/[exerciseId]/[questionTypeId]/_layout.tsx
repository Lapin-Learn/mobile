import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='instruction' />
      <Stack.Screen name='jump-band' />
    </Stack>
  );
};

export default Layout;
