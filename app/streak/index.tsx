import { Text, View } from 'react-native';

import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/molecules/PlatformView';

export default function Streak() {
  return (
    <PlatformView>
      <NavigationBar headerTitle={'Streak'} headerLeftShown />
      <View className='flex h-full items-center justify-center'>
        <Text>Streak</Text>
      </View>
    </PlatformView>
  );
}
