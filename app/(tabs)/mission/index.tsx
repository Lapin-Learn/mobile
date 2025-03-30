import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, StyleSheet, Text, View } from 'react-native';

import MissionIcon from '~/components/icons/MissionIcon';
import { Loading } from '~/components/molecules/Loading';
import { MissionSection } from '~/components/molecules/mission/MissionSection';
import PlatformView from '~/components/templates/PlatformView';
import Styles from '~/constants/GlobalStyles';
import { useMissions } from '~/hooks/react-query/useMission';

const Mission = () => {
  const { t } = useTranslation('mission');
  const { data: missionData, isFetching } = useMissions();

  const now = useMemo(() => new Date(), []);
  const monthIndex = now.getMonth();

  const nextDay = useMemo(() => {
    const date = new Date(now);
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [now]);

  const nextMonth = useMemo(() => {
    const date = new Date(now);
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    date.setHours(23, 59, 59, 999);
    return date;
  }, [now]);

  const remainingDailyTime = useCountdown(nextDay.getTime());
  const remainingMonthlyTime = useCountdown(nextMonth.getTime());

  const dailyMissions = useMemo(() => missionData?.filter((item) => item.interval === 'daily') || [], [missionData]);
  const monthlyMissions = useMemo(
    () => missionData?.filter((item) => item.interval === 'monthly') || [],
    [missionData]
  );

  const monthMission = useMemo(
    () =>
      t('month_mission', {
        month: (t('calendar.months', { returnObjects: true, ns: 'translation' }) as string[])[monthIndex],
      }),
    [t, monthIndex]
  );

  if (isFetching) return <Loading />;

  return (
    <PlatformView style={{ ...Styles.backgroundColor.blue[100], paddingBottom: 0 }}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <View style={StyleSheet.flatten([styles.monthMissionContainer, Styles.backgroundColor.blue[50]])}>
            <Text style={StyleSheet.flatten([Styles.font.semibold, Styles.fontSize.subhead, Styles.color.blue[700]])}>
              {monthMission}
            </Text>
          </View>
          <Text style={styles.guidelineText}>{t('guildline')}</Text>
        </View>
        <MissionIcon.Month code={monthIndex + 1} />
      </View>
      <View style={styles.scrollViewContainer}>
        {dailyMissions.length > 0 && (
          <MissionSection title={t('types.daily')} timeRemaining={remainingDailyTime} missions={dailyMissions} />
        )}
        {monthlyMissions.length > 0 && (
          <MissionSection title={t('types.monthly')} timeRemaining={remainingMonthlyTime} missions={monthlyMissions} />
        )}
      </View>
    </PlatformView>
  );
};

const useCountdown = (targetTime: number) => {
  const calculateRemainingTime = () => Math.max(0, targetTime - new Date().getTime());

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

  useEffect(() => {
    let isSubscribed = true;

    const updateRemainingTime = () => {
      if (isSubscribed) {
        setRemainingTime(calculateRemainingTime());
      }
    };

    const interval = setInterval(updateRemainingTime, 1000);
    const subscription = AppState.addEventListener('change', updateRemainingTime);

    updateRemainingTime();

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      subscription.remove();
    };
  }, [targetTime]);

  return remainingTime;
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    padding: 16,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 8,
  },
  monthMissionContainer: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  guidelineText: {
    flexShrink: 1,
    ...Styles.font.medium,
    ...Styles.fontSize.subhead,
    ...Styles.color.blue[700],
  },
  scrollViewContainer: {
    height: '100%',
    ...Styles.backgroundColor.background,
  },
});

export default Mission;
