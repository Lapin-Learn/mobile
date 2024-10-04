import { Text, View } from 'react-native';

import IconCarrot from '~/assets/images/carrot.svg';
import IconLostStreak from '~/assets/images/lost-streak.svg';
import IconStreak from '~/assets/images/streak.svg';
import { Loading } from '~/components/molecules/Loading';
import XpTrackBar from '~/components/molecules/XpTrackBar';
import { useGameProfile } from '~/hooks/react-query/useUser';
import { RankEnum } from '~/lib/enums';
import { formatNumber } from '~/lib/utils';

export default function TrackBar() {
  const { data, isFetching, error } = useGameProfile();

  if (isFetching) {
    return (
      <View className='h-screen w-screen'>
        <Loading />
      </View>
    );
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  if (!data) return null;

  return (
    <View className='z-50 m-4 flex flex-row items-center justify-center gap-6'>
      <View className='flex flex-row items-center justify-center gap-[2px]'>
        {data.streak.current > 0 ? <IconStreak width={28} height={28} /> : <IconLostStreak width={28} height={28} />}
        <Text className={`title-4 font-bold ${data.streak.current > 0 ? 'text-orange-500' : 'text-neutral-400'}`}>
          {data.streak.current}
        </Text>
      </View>
      <View className='flex flex-row items-center justify-center gap-[2px]'>
        <IconCarrot width={28} height={28} />
        <Text className='title-4 font-bold text-orange-400'>{formatNumber(data.carrots)}</Text>
      </View>
      <View className='flex flex-row items-center justify-center'>
        <XpTrackBar level={data.level.id} currentXp={data.xp} levelXp={data.level.xp} rank={data.rank as RankEnum} />
      </View>
    </View>
  );
}
