import { router, Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name='forgot-password'
        options={{
          title: 'Forgot Password',
          headerLeft: () => {
            return (
              <ChevronLeft
                size={24}
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/auth/sign-in'))}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name='verify'
        options={{
          presentation: 'modal',
          title: 'OTP Verification',
          headerLeft: () => {
            return (
              <ChevronLeft size={24} onPress={() => (router.canGoBack() ? router.back() : router.replace('../'))} />
            );
          },
        }}
      />
      <Stack.Screen name='reset-password' options={{ title: 'Reset Password' }} />
    </Stack>
  );
}
