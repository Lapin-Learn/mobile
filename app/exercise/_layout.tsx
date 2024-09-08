import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name='[slug]' options={{ headerShown: false }} />
    </Stack>
  );
}
