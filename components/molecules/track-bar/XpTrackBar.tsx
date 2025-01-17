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
      <View style={StyleSheet.flatten([styles.root, { gap: 6 }])}>
        <RankIcon name={rank} {...Styles.iconSize.base} />
        <View style={{ width: 120 }}>
          <View style={StyleSheet.flatten([styles.root, { alignItems: 'flex-end', justifyContent: 'space-between' }])}>
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
    ...Styles.fontSize.subhead,
    ...Styles.font.semibold,
    ...Styles.color.blue[700],
  },
  textXp: {
    ...Styles.fontSize['caption-2'],
    ...Styles.font.normal,
    ...Styles.color.blue[700],
  },
  trackBar: {
    height: 6,
    borderRadius: 999,
    ...Styles.backgroundColor.neutral[50],
  },
  trackBarProgress: {
    height: 6,
    borderRadius: 999,
    ...Styles.backgroundColor.blue[400],
  },
});
export default XpTrackBar;
