import { Clock } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import MissionIcon from '~/components/icons/MissionIcon';
import { ListMissions } from '~/components/molecules/mission/ListMissions';
import { MissionsProps } from '~/components/molecules/mission/type';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { ProfileSection as MissionSection } from '~/components/molecules/profile/ProfileSection';
import PlatformView from '~/components/templates/PlatformView';
import { formatRemainingToDateTime } from '~/lib/utils';

const dailyMissionData: MissionsProps = {
  type: 'daily',
  timestamp: (Date.now() + 1 * 60 * 1000).toString(),
  data: [
    { code: 'collect_carrots', value: '20', current: '10', target: '20' },
    { code: 'exercise', value: '20', current: '5', target: '5' },
    { code: 'learn_a_new_skill', value: '20', current: '1', target: '5' },
  ],
};

const monthlyMissionData: MissionsProps = {
  type: 'monthly',
  timestamp: (Date.now() + 5 * 60 * 60 * 1000).toString(),
  data: [
    { code: 'take_a_new_course', value: '20', current: '10', target: '20' },
    { code: 'learn_a_new_language', value: '20', current: '1', target: '5' },
    { code: 'learn_a_new_skill', value: '20', current: '1', target: '5' },
  ],
};

const monthIndex = new Date().getMonth();

const Mission = () => {
  const { t } = useTranslation('mission');

  const useCountdown = (initialTime: number) => {
    const [remainingTime, setRemainingTime] = useState(initialTime);

    useEffect(() => {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    return remainingTime;
  };

  const remainingDailyTime = useCountdown(parseInt(dailyMissionData.timestamp) - new Date().getTime());
  const remainingMonthlyTime = useCountdown(parseInt(monthlyMissionData.timestamp) - new Date().getTime());

  const monthMission = t('month_mission', {
    month: (t('calendar.months', { returnObjects: true, ns: 'translation' }) as string[])[monthIndex],
  });

  return (
    <PlatformView className='bg-blue-100'>
      <NavigationBar headerTitle={'Mission'} headerLeftShown />
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
          <MissionSection className='px-4 pt-5'>
            <MissionSection.Title
              label={t('types.daily')}
              className='items-end'
              textClassName='font-isemibold text-title-2 text-black'>
              <View className='flex-row gap-x-1'>
                <Clock className='h-5 w-5' color={'#F17D53'} />
                <Text className='font-imedium text-subhead text-orange-400'>
                  {t('time_remaining', { time: formatRemainingToDateTime(remainingDailyTime) })}
                </Text>
              </View>
            </MissionSection.Title>
            <MissionSection.Group className='bg-white'>
              <ListMissions {...dailyMissionData} />
            </MissionSection.Group>
          </MissionSection>
          <MissionSection className='px-4 pt-5'>
            <MissionSection.Title
              label={t('types.monthly')}
              className='items-end'
              textClassName='font-isemibold text-title-2 text-black'>
              <View className='flex-row gap-x-1'>
                <Clock className='h-5 w-5' color={'#F17D53'} />
                <Text className='font-imedium text-subhead text-orange-400'>
                  {t('time_remaining', { time: formatRemainingToDateTime(remainingMonthlyTime) })}
                </Text>
              </View>
            </MissionSection.Title>
            <MissionSection.Group className='bg-white'>
              <ListMissions {...monthlyMissionData} />
            </MissionSection.Group>
          </MissionSection>
        </ScrollView>
      </View>
    </PlatformView>
  );
};

export default Mission;
