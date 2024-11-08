import { StyleSheet, Text, View } from 'react-native';

import RankIcon from '~/components/icons/RankIcon';
import Styles from '~/constants/GlobalStyles';
import { RankEnum } from '~/lib/enums';
import { formatNumber } from '~/lib/utils';

import { styles } from './styles';

type XpTrackBarProps = {
  level?: number;
  currentXp?: number;
  levelXp?: number;
  rank?: RankEnum;
};

const XpTrackBar = ({ level = 1, currentXp = 0, levelXp = 100, rank = RankEnum.BRONZE }: XpTrackBarProps) => {
  return (
    <View style={styles.root}>
      <View style={StyleSheet.flatten([styles.root, { gap: 1 }])}>
        <RankIcon name={rank} width={24} height={24} />
        <View style={{ width: 120 }}>
          <View style={StyleSheet.flatten([styles.root, { gap: 1, justifyContent: 'space-between' }])}>
            <Text style={trackBarStyles.textLevel}>Lv. {level}</Text>
            <Text style={trackBarStyles.textXp}>
              {formatNumber(currentXp)}/{formatNumber(levelXp)}
            </Text>
          </View>
          <View>
            <View style={trackBarStyles.trackBar}>
              <View
                style={[
                  trackBarStyles.trackBarProgress,
                  { width: `${currentXp > levelXp ? 100 : (currentXp / levelXp) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const trackBarStyles = StyleSheet.create({
  textLevel: {
    ...Styles.fontSize['caption-1'],
    ...Styles.font.bold,
    ...Styles.color.blue[700],
  },
  textXp: {
    ...Styles.fontSize['caption-1'],
    ...Styles.font.normal,
    ...Styles.color.blue[700],
  },
  trackBar: {
    height: 6,
    borderRadius: 999,
    ...Styles.backgroundColor.neutral[200],
  },
  trackBarProgress: {
    height: 6,
    borderRadius: 999,
    ...Styles.backgroundColor.blue[300],
  },
});
export default XpTrackBar;
