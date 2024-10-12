import { Href, router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Loading } from '~/components/molecules/Loading';
import { useGameProfile } from '~/hooks/react-query/useUser';

import Carrots from './Carrots';
import Streak from './Streak';
import XpTrackBar from './XpTrackBar';

const TrackBar = () => {
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
      <Pressable onPress={() => router.push('/streak' as Href)}>
        <Streak streak={data.streak.current} />
      </Pressable>
      <Pressable onPress={() => router.push('/items' as Href)}>
        <Carrots carrots={data.carrots} />
      </Pressable>
      <XpTrackBar level={data.level.id} currentXp={data.xp} levelXp={data.level.xp} rank={data.rank} />
    </View>
  );
};
export default TrackBar;
