import { Stack } from 'expo-router';
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name='link' options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
