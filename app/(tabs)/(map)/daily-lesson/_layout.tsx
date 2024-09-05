import { Stack } from 'expo-router';

import { hydrate } from '~/hooks/zustand';

hydrate(); // Hydrate the store when the app starts

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
    </Stack>
  );
}
