import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='explanation' />
      <Stack.Screen name='[lessonId]' />
    </Stack>
  );
};

export default Layout;
