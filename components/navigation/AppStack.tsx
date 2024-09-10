import { Stack } from 'expo-router';

export function AppStack() {
  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='auth' options={{ headerShown: false }} />
      <Stack.Screen name='firebaseauth' options={{ headerShown: false }} />
      <Stack.Screen name='exercise' options={{ headerShown: false }} />
      <Stack.Screen name='review' options={{ headerShown: false }} />
    </Stack>
  );
}
