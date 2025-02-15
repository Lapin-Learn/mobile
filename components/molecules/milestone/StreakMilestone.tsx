import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import StreakIcon from '~/components/icons/StreakIcon';
import { Button } from '~/components/ui/Button';
import { Text } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';
import { useStreaks } from '~/hooks/react-query/useStreak';
import { GLOBAL_STYLES } from '~/lib/constants';

import PlatformView from '../../templates/PlatformView';
import { Loading } from '../Loading';
import { getCurrentWeekBooleanObject } from './helpers';
import { MilestoneProps } from './type';
import { IStreakHistory } from '~/lib/types';

const WeekRecord = ({ streakRecords }: { streakRecords: IStreakHistory[] }) => {
  const { t, i18n } = useTranslation();

  const DAYS_OF_WEEK: string[] = (t('calendar.days_of_week', { returnObjects: true }) as string[]) ?? [];
  const weekMap = getCurrentWeekBooleanObject(streakRecords, DAYS_OF_WEEK);

  return (
    <View style={weekRecordStyles.root}>
      {Object.keys(weekMap).map((date, index) => (
        <View key={index} style={weekRecordStyles.view}>
          <Text style={weekRecordStyles.text}>{i18n.language === 'en' ? date[0] : date}</Text>
          {weekMap[date] ? (
            weekMap[date] === "freeze" ? (
              <StreakIcon variant="freeze" />
            ) : (
              <StreakIcon variant="done" />
            )
          ) : weekMap[date] === false ? (
            <StreakIcon variant="miss" />
          ) : (
            <StreakIcon variant="neutral" />
          )}
        </View>
      ))}
    </View>
  );
};

const weekRecordStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: 16,
  },
  view: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  text: {
    ...Styles.fontSize.body,
    ...Styles.font.semibold,
    ...Styles.color.neutral[200],
  },
});

export const StreakMilestone = ({ current, handleNextMilestone }: MilestoneProps) => {
  const { t } = useTranslation('milestone');
  const { data, isPending } = useStreaks({});

  const [streakRecords, setStreakRecords] = useState<IStreakHistory[]>([]);

  useEffect(() => {
    setStreakRecords(data ?? []);
  }, [data]);

  if (isPending) {
    return <Loading />;
  }

  return (
    <PlatformView style={styles.root}>
      <View />
      <View style={styles.main}>
        <LottieView
          source={require('~/assets/images/streak_flame.json')}
          autoPlay
          loop={true}
          style={{ width: 139, height: 192 }}
        />
        <View style={styles.streak}>
          <Text style={styles.value}>{current.newValue as number}</Text>
          <Text style={styles.days}>{t('streak.day')}</Text>
        </View>
        <View style={{ display: 'flex', gap: 16 }}>
          <WeekRecord streakRecords={streakRecords} />
          <Text style={styles.text}>{t('streak.congratulation')} </Text>
        </View>
      </View>
      <Button onPress={handleNextMilestone} size='lg'>
        <Text style={GLOBAL_STYLES.textButton}>{t('button.next')}</Text>
      </Button>
    </PlatformView>
  );
};

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 16,

    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 16,
    flexDirection: 'column',
  },
  text: {
    textAlign: 'center',
    ...Styles.font.semibold,
    ...Styles.fontSize.body,
    ...Styles.color.neutral[600],
  },
  days: {
    ...Styles.fontSize['title-1'],
    ...Styles.font.semibold,
    ...Styles.color.dark,
  },
  value: {
    ...Styles.fontSize.streak,
    ...Styles.font.bold,
    ...Styles.color.dark,
  },
  main: {
    width: '100%',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 16,
  },
  streak: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
});
