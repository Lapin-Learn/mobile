import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Loading } from '~/components/molecules/Loading';
import XpTrackBar from '~/components/molecules/XpTrackBar';
import { useGameProfile } from '~/hooks/react-query/useUser';
import { RankEnum } from '~/lib/enums';

import Carrots from './Carrots';
import Streak from './Streak';

export default function TrackBar() {
  const { data, isFetching, error } = useGameProfile();

  if (isFetching) {
    return (
      <View className='h-screen'>
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
      <Pressable onPress={() => router.push('/streak')}>
        <Streak streak={data.streak.current} />
      </Pressable>
      <Pressable onPress={() => router.push('/items')}>
        <Carrots carrots={data.carrots} />
      </Pressable>
      <XpTrackBar level={data.level.id} currentXp={data.xp} levelXp={data.level.xp} rank={data.rank as RankEnum} />
    </View>
  );
}
