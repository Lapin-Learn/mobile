import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, ScrollView, StyleSheet, Text, View } from 'react-native';

import MissionIcon from '~/components/icons/MissionIcon';
import { Loading } from '~/components/molecules/Loading';
import { MissionSection } from '~/components/molecules/mission/MissionSection';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
import Styles from '~/constants/GlobalStyles';
import { useMissions } from '~/hooks/react-query/useMission';

const Mission = () => {
  const { t } = useTranslation('mission');
  const { data: missionData, isFetching } = useMissions();

  const monthIndex = new Date().getMonth();
  const NewDate = new Date().setHours(24, 0, 0, 0);
  const NewMonth = new Date().setMonth(monthIndex + 1, 0);

  const remainingDailyTime = useCountdown(NewDate);
  const remainingMonthlyTime = useCountdown(NewMonth);

  const monthMission = t('month_mission', {
    month: (t('calendar.months', { returnObjects: true, ns: 'translation' }) as string[])[monthIndex],
  });

  if (isFetching) return <Loading />;

  const dailyMissions = missionData?.filter((item) => item.interval === 'daily') || [];
  const monthlyMissions = missionData?.filter((item) => item.interval === 'monthly') || [];

  return (
    <PlatformView style={{ ...Styles.backgroundColor.blue[100] }}>
      <NavigationBar headerTitle='Mission' displayStyle='center' />
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
        <ScrollView>
          {dailyMissions?.length > 0 && (
            <MissionSection title={t('types.daily')} timeRemaining={remainingDailyTime} missions={dailyMissions} />
          )}
          {monthlyMissions?.length > 0 && (
            <MissionSection
              title={t('types.monthly')}
              timeRemaining={remainingMonthlyTime}
              missions={monthlyMissions}
            />
          )}
        </ScrollView>
      </View>
    </PlatformView>
  );
};

const useCountdown = (targetTime: number) => {
  const [remainingTime, setRemainingTime] = useState(targetTime - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      AppState.addEventListener('change', () => {
        setRemainingTime(targetTime - new Date().getTime());
      });

      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
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
