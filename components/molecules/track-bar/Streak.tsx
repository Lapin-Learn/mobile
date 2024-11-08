import { StyleSheet, Text, View } from 'react-native';

import IconLostStreak from '~/assets/images/lost-streak.svg';
import IconStreak from '~/assets/images/streak.svg';
import { formatNumber } from '~/lib/utils';

import { styles } from './styles';

type StreakProps = {
  streak: number;
};

const Streak = ({ streak }: StreakProps) => {
  return (
    <View style={styles.root}>
      {streak > 0 ? <IconStreak width={28} height={28} /> : <IconLostStreak width={28} height={28} />}
      <Text style={StyleSheet.flatten([styles.text, streak > 0 ? {} : styles.broken])}>{formatNumber(streak)}</Text>
    </View>
  );
};

export default Streak;
