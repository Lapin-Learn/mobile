import { StyleSheet, Text, View } from 'react-native';

import IconLostStreak from '~/assets/images/lost-streak.svg';
import IconStreak from '~/assets/images/streak.svg';
import { IStreak } from '~/lib/types';
import { formatNumber } from '~/lib/utils';

import { styles } from './styles';

type StreakProps = {
  streak: IStreak;
};

const Streak = ({ streak }: StreakProps) => {
  return (
    <View style={styles.root}>
      {streak.extended ? <IconStreak width={28} height={28} /> : <IconLostStreak width={28} height={28} fill='blue' />}
      <Text style={StyleSheet.flatten([styles.text, streak.extended ? {} : styles.broken])}>
        {formatNumber(streak.current)}
      </Text>
    </View>
  );
};

export default Streak;
