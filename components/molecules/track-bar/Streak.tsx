import { Text, View } from 'react-native';

import IconLostStreak from '~/assets/images/lost-streak.svg';
import IconStreak from '~/assets/images/streak.svg';
import { cn, formatNumber } from '~/lib/utils';

export default function Streak({ streak }: { streak: number }) {
  return (
    <View className='flex flex-row items-center justify-center gap-[2px]'>
      {streak > 0 ? <IconStreak width={28} height={28} /> : <IconLostStreak width={28} height={28} />}
      <Text className={cn('title-4 font-bold', streak > 0 ? 'text-orange-500' : 'text-neutral-400')}>
        {formatNumber(streak)}
      </Text>
    </View>
  );
}
