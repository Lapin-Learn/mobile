import { router, Stack } from 'expo-router';
import { LucideMoveLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='[randomId]'
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
};

export default Layout;
