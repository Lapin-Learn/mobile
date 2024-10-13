import { Text, View } from 'react-native';

import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';

const Items = () => {
  return (
    <PlatformView>
      <NavigationBar headerTitle={'Items'} headerLeftShown />
      <View className='flex h-full items-center justify-center'>
        <Text>Items</Text>
      </View>
    </PlatformView>
  );
};

export default Items;
