import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { useGameProfile } from '~/hooks/react-query/useUser';

import Carrots from './Carrots';
import Streak from './Streak';
import XpTrackBar from './XpTrackBar';

type TrackBarProps = {
  data: ReturnType<typeof useGameProfile>['data'];
};

const TrackBar = ({ data }: TrackBarProps) => {
  const { height } = useWindowDimensions();
  if (!data) return null;

  return (
    <View
      style={[
        styles.root,
        {
          paddingVertical: (height % 8) + 4,
        },
      ]}>
      <Pressable onPress={() => router.push('/streak' as Href)}>
        <Streak streak={data.streak} />
      </Pressable>
      <Pressable onPress={() => router.push('/items' as Href)}>
        <Carrots carrots={data.carrots} size='base' textStyle={{ ...Styles.color.orange[400] }} />
      </Pressable>
      <XpTrackBar level={data.level.id} currentXp={data.xp} levelXp={data.level.xp} rank={data.rank} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    ...Styles.backgroundColor.white,
    borderRadius: 100,
  },
});
export default TrackBar;
