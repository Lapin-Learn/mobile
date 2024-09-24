import { Stack } from 'expo-router';
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name='link' options={{ headerShown: false }} />
    </Stack>
  );
}
