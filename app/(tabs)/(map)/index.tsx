import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';
import { FlatList } from 'react-native';

import { Loading } from '~/components/molecules/Loading';
import { Region } from '~/components/molecules/map/Region';
import { Welcome } from '~/components/molecules/map/Welcome';
import { StreakFreezeModal } from '~/components/molecules/StreakFreezeModal';
import TrackBar from '~/components/molecules/track-bar/TrackBar';
import PlatformView from '~/components/templates/PlatformView';
import { Text } from '~/components/ui/Text';
import { useGameProfile } from '~/hooks/react-query/useUser';
import { SkillEnum } from '~/lib/enums';

const Index = () => {
  const { data, isFetching, error } = useGameProfile();

  if (isFetching) {
    return <Loading />;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <>
      <LinearGradient colors={['#FFF4E3', '#FFFFFF']} style={{ position: 'absolute', width: '100%', height: '100%' }} />
      <PlatformView style={{ gap: 16, margin: 16 }}>
        <Welcome />

        <TrackBar data={data} />
        <Map />
        <StreakFreezeModal gameProfile={data} />
      </PlatformView>
    </>
  );
};

const Map = () => {
  return (
    <FlatList
      style={{}}
      contentContainerStyle={{ justifyContent: 'center', gap: 16 }}
      columnWrapperStyle={{ justifyContent: 'center', gap: 16 }}
      numColumns={2}
      scrollEnabled={false}
      data={Object.values(SkillEnum)}
      renderItem={({ item }) => <Region name={item} />}
    />
  );
};

export default Index;
