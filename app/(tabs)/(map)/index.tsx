import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Loading } from '~/components/molecules/Loading';
import { Region } from '~/components/molecules/map/Region';
import { Welcome } from '~/components/molecules/map/Welcome';
import { StreakFreezeModal } from '~/components/molecules/StreakFreezeModal';
import TrackBar from '~/components/molecules/track-bar/TrackBar';
import { Updating } from '~/components/molecules/Updating';
import PlatformView from '~/components/templates/PlatformView';
import { Text } from '~/components/ui/Text';
import { useGameProfile } from '~/hooks/react-query/useUser';
import { SkillEnum } from '~/lib/enums';

const Index = () => {
  const { data, isFetching, error } = useGameProfile();
  const { bottom } = useSafeAreaInsets();
  const [showUpdating, setShowUpdating] = useState(true);

  if (isFetching) {
    return <Loading />;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <>
      <LinearGradient colors={['#FFF4E3', '#FFFFFF']} style={{ position: 'absolute', width: '100%', height: '100%' }} />
      {showUpdating && <Updating visible={showUpdating} setVisible={setShowUpdating} />}
      <PlatformView
        style={{
          height: '100%',
          marginHorizontal: 16,
          justifyContent: 'flex-start',
        }}>
        <Welcome />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-around',
          }}>
          <TrackBar data={data} />
          <Map />
        </View>
        <View style={{ height: bottom * 1.5 }} />
      </PlatformView>
      <StreakFreezeModal gameProfile={data} />
    </>
  );
};

const Map = () => {
  return (
    <FlatList
      style={{ flexGrow: 0 }}
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
