import { router, Stack } from 'expo-router';
import { LucideMoveLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name='[reviewId]'
        options={{
          headerTransparent: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 28,
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <LucideMoveLeft />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
