import { Href, router } from 'expo-router';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { useGameProfile } from '~/hooks/react-query/useUser';

import Carrots from './Carrots';
import Streak from './Streak';
import XpTrackBar from './XpTrackBar';

type TrackBarProps = {
  data: ReturnType<typeof useGameProfile>['data'];
};

const TrackBar = ({ data }: TrackBarProps) => {
  const { height } = Dimensions.get('window');
  if (!data) return null;

  return (
    <View
      style={[
        styles.root,
        {
          paddingVertical: Math.max((height % 8) + 4, 0),
        },
      ]}>
      <TouchableOpacity onPress={() => router.push('/streak' as Href)} style={styles.touchableSection}>
        <Streak streak={data.streak} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/items' as Href)}>
        <Carrots
          carrots={data.carrots}
          size='base'
          textStyle={{ ...Styles.color.orange[400] }}
          style={styles.touchableSection}
        />
      </TouchableOpacity>
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
    gap: 8,
    ...Styles.backgroundColor.white,
    borderRadius: 100,
  },
  touchableSection: {
    padding: 8,
  },
});
export default TrackBar;
