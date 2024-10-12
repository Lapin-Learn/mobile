import { Stack } from 'expo-router';

export function AppStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='on-boarding' />
      <Stack.Screen name='update-profile' />
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='auth' />
      <Stack.Screen name='edit-profile' />
      <Stack.Screen name='firebaseauth' />
      <Stack.Screen name='exercise' />
      <Stack.Screen name='random' />
      <Stack.Screen name='lesson' />
      <Stack.Screen name='items' />
      <Stack.Screen name='streak' />
    </Stack>
  );
}
