import { Stack } from 'expo-router';

export function AppStack() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='on-boarding' options={{ headerShown: false }} />
      <Stack.Screen name='update-profile' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='auth' options={{ headerShown: false }} />
      <Stack.Screen name='edit-profile' options={{ headerShown: false }} />
      <Stack.Screen name='firebaseauth' options={{ headerShown: false }} />
      <Stack.Screen name='exercise' options={{ headerShown: false }} />
      <Stack.Screen name='random' options={{ headerShown: false }} />
      <Stack.Screen name='lesson' options={{ headerShown: false }} />
    </Stack>
  );
}
