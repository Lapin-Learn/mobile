import { Text, View } from 'react-native';

import { RankEnum } from '~/lib/enums';
import { formatNumber } from '~/lib/utils';

import RankIcon from '../icons/RankIcon';

type XpTrackBarProps = {
  level: number;
  currentXp: number;
  levelXp: number;
  rank: RankEnum;
};

export default function XpTrackBar({ level, currentXp, levelXp, rank }: XpTrackBarProps) {
  return (
    <View className='flex flex-row items-center gap-1'>
      <RankIcon name={rank} width={24} height={24} />
      <View className='w-40'>
        <View className='flex flex-row items-center justify-between'>
          <Text className='text-subhead font-bold text-blue-700'>Lv. {level}</Text>
          <Text className='text-caption-2 text-blue-700'>
            {formatNumber(currentXp)}/{formatNumber(levelXp)}
          </Text>
        </View>
        <View>
          <View className='h-[6px] rounded-full bg-gray-200'>
            <View className='h-[6px] rounded-full bg-blue-300' style={{ width: `${(currentXp / levelXp) * 100}%` }} />
          </View>
        </View>
      </View>
    </View>
  );
}