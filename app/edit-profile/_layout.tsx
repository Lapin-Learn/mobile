import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='change-password' options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
