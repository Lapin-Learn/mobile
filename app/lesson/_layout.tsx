import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name='explanation' options={{ headerShown: false }} />
      <Stack.Screen name='[lessonId]' options={{ headerShown: false }} />
    </Stack>
  );
}
