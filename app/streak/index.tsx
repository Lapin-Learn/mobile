import { startOfMonth, subMonths } from 'date-fns';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import CustomCalendar from '~/components/molecules/custom-calendar';
import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { TargetStreak } from '~/components/molecules/TargetStreak';
import PlatformView from '~/components/templates/PlatformView';
import Styles from '~/constants/GlobalStyles';
import { useStreaks } from '~/hooks/react-query/useStreak';
import { useGameProfile } from '~/hooks/react-query/useUser';

export const generateTarget = (days: number) => {
  const base = 25;
  let max = 100;

  while (days > max) {
    max *= 2;
  }

  const columns = [];
  for (let i = 1; i <= 4; i++) {
    columns.push({ value: base * i, active: false });
  }

  const scaledColumns = columns.map((column) => {
    const value = column.value * (max / 100);
    return {
      value: value,
      active: value <= days,
    };
  });

  return scaledColumns;
};

const Streak = () => {
  const { t } = useTranslation();
  const { data, isFetching } = useGameProfile();
  const { data: streakDays } = useStreaks({ startDate: startOfMonth(subMonths(new Date(), 13)).toString() });

  const textStyle = data?.streak.current === 0 ? 'broken' : 'extended';
  const isLongestStreak = data?.streak.current === data?.streak.record;
  if (isFetching) return <Loading />;

  return (
    <>
      <PlatformView style={styles.platformView}>
        <NavigationBar headerTitle='Streak' headerLeftShown />
        <View style={styles.recordStreakContainer}>
          <View style={styles.recordStreakSection}>
            <View style={styles.recordStreakTitleSection}>
              <View>
                <Text style={StyleSheet.flatten([styles.recordStreakTitle1, textStyles[textStyle]])}>
                  {data?.streak.current}
                </Text>
                <Text style={StyleSheet.flatten([styles.recordStreakTitle2, textStyles[textStyle]])}>
                  {t('streak.days')}
                </Text>
              </View>
              <Text style={styles.recordStreakCaption}>
                {t('streak.max', { max: isLongestStreak ? t('streak.this') : data?.streak.record })}
              </Text>
            </View>
            <LottieView
              source={require('~/assets/images/streak_flame.json')}
              autoPlay
              loop={true}
              style={{ width: 100, height: 125 }}
            />
          </View>
          <View style={styles.targetStreakList}>
            {generateTarget(data?.streak.current ?? 0).map(({ value, active }, index) => (
              <TargetStreak key={index} width={74} height={80} active={active}>
                <View style={styles.targetStreakItem}>
                  <Text style={styles.targetStreakText}>{value}</Text>
                </View>
              </TargetStreak>
            ))}
          </View>
        </View>
        <View style={styles.streakHistorySection}>
          <Text style={styles.streakHistoryHeader}>{t('streak.schedule')}</Text>
          <CustomCalendar activeDays={(streakDays ?? []).map((day) => new Date(day.date))} />
        </View>
      </PlatformView>
      <SafeAreaView style={styles.bottomArea} />
    </>
  );
};

const textStyles = StyleSheet.create({
  extended: {
    color: Styles.color.blue.DEFAULT.color,
  },
  broken: {
    color: '#849EBC',
  },
});

const styles = StyleSheet.create({
  recordStreakContainer: {
    display: 'flex',
    rowGap: 32,
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  recordStreakSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  recordStreakTitleSection: {
    width: '100%',
    flex: 1,
    rowGap: 16,
  },
  recordStreakTitle1: {
    ...Styles.font.black,
    ...Styles.fontSize.streak,
    marginBottom: 4,
  },
  recordStreakTitle2: {
    ...Styles.font.semibold,
    ...Styles.fontSize['title-2'],
  },
  recordStreakCaption: {
    ...Styles.font.semibold,
    ...Styles.fontSize['caption-1'],
    color: Styles.color.dark.color,
    width: '100%',
    flexWrap: 'wrap',
  },
  targetStreakList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetStreakItem: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetStreakText: {
    ...Styles.font.semibold,
    ...Styles.fontSize['title-2'],
    color: Styles.color.white.color,
  },
  platformView: {
    flex: 1,
    backgroundColor: '#E7F4FE',
  },
  bottomArea: {
    flex: 0,
    backgroundColor: Styles.color.background.color,
  },
  streakHistoryHeader: {
    ...Styles.font.semibold,
    ...Styles.fontSize['title-2'],
  },
  streakHistorySection: {
    display: 'flex',
    flex: 1,
    flexGrow: 1,
    rowGap: 16,
    backgroundColor: Styles.color.background.color,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
export default Streak;
