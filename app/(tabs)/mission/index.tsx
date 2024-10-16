import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, ScrollView, Text, View } from 'react-native';

import MissionIcon from '~/components/icons/MissionIcon';
import { Loading } from '~/components/molecules/Loading';
import { MissionSection } from '~/components/molecules/mission/MissionSection';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/templates/PlatformView';
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
    <PlatformView className='bg-blue-100'>
      <NavigationBar headerTitle='Mission' headerLeftShown />
      <View className='flex-0 flex w-full flex-row items-center justify-between p-4'>
        <View className='flex-1 items-start justify-start gap-y-2'>
          <View className='rounded bg-blue-50 px-3 py-1'>
            <Text className='font-isemibold text-subhead text-blue-700'>{monthMission}</Text>
          </View>
          <Text className='shrink font-imedium text-subhead text-blue-700'>{t('guildline')}</Text>
        </View>
        <MissionIcon.Month code={monthIndex + 1} />
      </View>
      <View className='flex-1 bg-background pb-4'>
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

export default Mission;
