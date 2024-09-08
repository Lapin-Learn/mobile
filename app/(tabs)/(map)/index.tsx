import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IconCarrot from '~/assets/images/carrot.svg';
import IconRank from '~/assets/images/rank.svg';
import IconStreak from '~/assets/images/streak.svg';

export default function CustomHeader() {
  return (
    <SafeAreaView>
      <View className='flex flex-row items-center justify-center gap-10 m-4'>
        <View className='flex flex-row items-center justify-center'>
          <IconStreak width={32} height={32} />
          <Text className='text-orange-500 title-4 font-bold'>1234</Text>
        </View>
        <View className='flex flex-row items-center justify-center'>
          <IconCarrot width={32} height={32} />
          <Text className='text-orange-400 title-4 font-bold'>500</Text>
        </View>
        <IconRank width={32} height={32} />
      </View>
      <Text>Map Here</Text>
    </SafeAreaView>
  );
}
