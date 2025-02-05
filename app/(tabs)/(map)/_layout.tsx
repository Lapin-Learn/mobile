import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, animationTypeForReplace: 'push', animation: 'fade' }}>
      <Stack.Screen name='index' />
    </Stack>
  );
};
export default Layout;
