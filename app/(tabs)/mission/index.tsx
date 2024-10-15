import { Clock } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, ScrollView, Text, View } from 'react-native';

import MissionIcon from '~/components/icons/MissionIcon';
import { ListMissions } from '~/components/molecules/mission/ListMissions';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { ProfileSection as MissionSection } from '~/components/molecules/profile/ProfileSection';
import PlatformView from '~/components/templates/PlatformView';
import { IMission } from '~/lib/types';
import { formatRemainingToDateTime } from '~/lib/utils';

const missionData: IMission[] = [
  {
    interval: 'daily',
    name: 'collect_carrots',
    description: '',
    rewards: 20,
    current: 10,
    quantity: 20,
  },
  {
    interval: 'daily',
    name: 'exercise',
    description: '',
    rewards: 20,
    current: 5,
    quantity: 5,
  },
  {
    interval: 'daily',
    name: 'learn_a_new_skill',
    description: '',
    rewards: 20,
    current: 1,
    quantity: 5,
  },
  {
    interval: 'monthly',
    name: 'take_a_new_course',
    description: '',

    rewards: 20,
    current: 10,
    quantity: 20,
  },
  {
    interval: 'monthly',
    name: 'learn_a_new_language',
    description: '',

    rewards: 20,
    current: 1,
    quantity: 5,
  },
  {
    interval: 'monthly',
    name: 'learn_a_new_skill',
    description: '',
    rewards: 20,
    current: 1,
    quantity: 5,
  },
];

const monthIndex = new Date().getMonth();
const NewDate = new Date().setHours(24, 0, 0, 0);
const NewMonth = new Date().setMonth(monthIndex + 1, 0);

const Mission = () => {
  const { t } = useTranslation('mission');

  const useCountdown = (initialTime: number) => {
    const [remainingTime, setRemainingTime] = useState(initialTime - new Date().getTime());
    useEffect(() => {
      const interval = setInterval(() => {
        AppState.addEventListener('change', () => {
          setRemainingTime(initialTime - new Date().getTime());
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
    }, []);

    return remainingTime;
  };

  const remainingDailyTime = useCountdown(NewDate);
  const remainingMonthlyTime = useCountdown(NewMonth);

  const monthMission = t('month_mission', {
    month: (t('calendar.months', { returnObjects: true, ns: 'translation' }) as string[])[monthIndex],
  });

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
          <MissionSection className='px-4 pt-5'>
            <MissionSection.Title
              label={t('types.daily')}
              className='items-end'
              textClassName='font-isemibold text-title-2 text-black'>
              <View className='flex-row items-center gap-x-1'>
                <Clock size={20} color='#F17D53' />
                <Text className='font-imedium text-subhead text-orange-400'>
                  {t('time_remaining', { time: formatRemainingToDateTime(remainingDailyTime) })}
                </Text>
              </View>
            </MissionSection.Title>
            <MissionSection.Group className='bg-white'>
              <ListMissions data={missionData.filter((item) => item.interval === 'daily')} />
            </MissionSection.Group>
          </MissionSection>
          <MissionSection className='px-4 pt-5'>
            <MissionSection.Title
              label={t('types.monthly')}
              className='items-end'
              textClassName='font-isemibold text-title-2 text-black'>
              <View className='flex-row items-center gap-x-1'>
                <Clock size={20} color='#F17D53' />
                <Text className='font-imedium text-subhead text-orange-400'>
                  {t('time_remaining', { time: formatRemainingToDateTime(remainingMonthlyTime) })}
                </Text>
              </View>
            </MissionSection.Title>
            <MissionSection.Group className='bg-white'>
              <ListMissions data={missionData.filter((item) => item.interval === 'monthly')} />
            </MissionSection.Group>
          </MissionSection>
        </ScrollView>
      </View>
    </PlatformView>
  );
};

export default Mission;
