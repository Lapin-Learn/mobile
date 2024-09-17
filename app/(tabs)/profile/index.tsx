import { Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { useSignOut } from '~/hooks/react-query/useAuth';

export default function Index() {
  const signOut = useSignOut();
  return (
    <View className='m-auto flex-col justify-around'>
      <Button onPress={() => signOut.mutate()} variant='outline'>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
