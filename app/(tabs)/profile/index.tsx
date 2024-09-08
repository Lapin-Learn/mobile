import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { hydrate, signOut, useAuth } from '~/hooks/zustand';

export default function Index() {
  const { status } = useAuth();

  useEffect(() => {
    hydrate();
  }, []);

  if (status === 'idle') {
    // Display loading indicator while hydrating the auth state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={50} color='blue' />
      </View>
    );
  }

  if (status === 'signOut') {
    return <Redirect href='/auth/sign-in' />;
  }

  return (
    <View className='m-auto flex-col justify-around'>
      <Button onPress={signOut} variant='outline'>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
