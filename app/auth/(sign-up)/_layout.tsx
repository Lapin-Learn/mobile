import { router, Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='sign-up'
        options={{
          headerShown: false,
          headerLeft: () => {
            return <ChevronLeft size={24} onPress={() => router.back()} />;
          },
        }}
      />
      <Stack.Screen
        name='verify'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
