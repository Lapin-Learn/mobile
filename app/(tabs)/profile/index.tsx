import { Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { signOut } from '~/hooks/zustand';

export default function Index() {
  return (
    <View className='m-auto flex-col justify-around'>
      <Button onPress={signOut} variant='outline'>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
