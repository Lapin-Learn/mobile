import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name='forgot-password'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='verify'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name='reset-password' options={{ headerShown: false }} />
    </Stack>
  );
}
