import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Loading } from '~/components/molecules/Loading';
import { SkillCard } from '~/components/molecules/map/SkillCard';
import { Welcome } from '~/components/molecules/map/Welcome';
import TrackBar from '~/components/molecules/track-bar/TrackBar';
import { Updating } from '~/components/molecules/Updating';
import { StreakFreezeModal } from '~/components/organisms/modals/StreakFreezeModal';
import PlatformView from '~/components/templates/PlatformView';
import { Text } from '~/components/ui/Text';
import { useGameProfile } from '~/hooks/react-query/useUser';
import { SkillEnum } from '~/lib/enums';

const Index = () => {
  const { data, isFetching, error } = useGameProfile();
  const { bottom } = useSafeAreaInsets();
  const [showUpdating, setShowUpdating] = useState(false);

  if (isFetching) {
    return <Loading />;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <>
      <LinearGradient colors={['#FFF4E3', '#FFFFFF']} style={{ position: 'absolute', width: '100%', height: '100%' }} />
      <Updating visible={showUpdating} setVisible={setShowUpdating} />
      <PlatformView
        style={{
          height: '100%',
          margin: 16,
          marginBottom: 0,
          justifyContent: 'flex-start',
        }}>
        <View style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Welcome />
          <TrackBar data={data} />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              flexGrow: 1,
              flexShrink: 1,
              flexBasis: 'auto',
            }}>
            <SkillGrid />
          </View>
          <View style={{ height: Platform.OS === 'ios' ? 140 : 100, width: '100%' }} />
        </View>
        <View style={{ height: bottom * 1.5 }} />
      </PlatformView>
      <StreakFreezeModal gameProfile={data} />
    </>
  );
};

const SkillGrid = () => {
  return (
    <FlatList
      style={{ flexGrow: 0, width: '100%' }}
      contentContainerStyle={{ justifyContent: 'center', gap: 16 }}
      columnWrapperStyle={{ justifyContent: 'center', gap: 16 }}
      numColumns={2}
      scrollEnabled={false}
      data={Object.values(SkillEnum)}
      renderItem={({ item }) => <SkillCard name={item} />}
    />
  );
};

export default Index;
