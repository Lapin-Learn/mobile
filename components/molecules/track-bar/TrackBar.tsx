import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useGameProfile } from '~/hooks/react-query/useUser';

import Carrots from './Carrots';
import Streak from './Streak';
import XpTrackBar from './XpTrackBar';

type TrackBarProps = {
  data: ReturnType<typeof useGameProfile>['data'];
};

const TrackBar = ({ data }: TrackBarProps) => {
  if (!data) return null;

  return (
    <View style={styles.root}>
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

const styles = StyleSheet.create({
  root: {
    zIndex: 50,
    margin: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
});
export default TrackBar;
