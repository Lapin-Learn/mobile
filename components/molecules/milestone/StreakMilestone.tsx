import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import StreakIcon from '~/components/icons/StreakIcon';
import { Button } from '~/components/ui/Button';
import { Text } from '~/components/ui/Text';
import { useStreaks } from '~/hooks/react-query/useStreak';

import PlatformView from '../../templates/PlatformView';
import { Loading } from '../Loading';
import { getCurrentWeekBooleanObject } from './helpers';
import { MilestoneProps } from './type';

const WeekRecord = ({ streakRecords }: { readonly streakRecords: string[] }) => {
  const { t, i18n } = useTranslation();

  const DAYS_OF_WEEK: string[] = (t('calendar.days_of_week', { returnObjects: true }) as string[]) ?? [];
  const weekMap = getCurrentWeekBooleanObject(streakRecords, DAYS_OF_WEEK);

  return (
    <View className='flex flex-row gap-4'>
      {Object.keys(weekMap).map((date, index) => (
        <View key={index} className='flex flex-col items-center justify-center gap-1'>
          <Text className='text-body font-semibold color-neutral-200'>{i18n.language === 'en' ? date[0] : date}</Text>
          {weekMap[date] ? (
            <StreakIcon variant='done' />
          ) : weekMap[date] === false ? (
            <StreakIcon variant='miss' />
          ) : (
            <StreakIcon variant='neutral' />
          )}
        </View>
      ))}
    </View>
  );
};

export const StreakMilestone = ({ current, handleNextMilestone }: MilestoneProps) => {
  const { t } = useTranslation('milestone');
  // TODO: recheck, because startDate param is the string for BE to parse data
  // 0 maybe equal to 1970-01-01, so it means we get all the streaks
  const { data, isPending } = useStreaks({ startDate: '0' });

  const [streakRecords, setStreakRecords] = useState<string[]>([]);

  useEffect(() => {
    setStreakRecords(data?.map((d) => d.date) ?? []);
  }, [data]);

  if (isPending) {
    return <Loading />;
  }

  return (
    <PlatformView className='mx-4 flex h-full justify-between py-4'>
      <View />
      <View className='flex w-full items-center gap-6 px-4'>
        <LottieView
          source={require('~/assets/images/streak_flame.json')}
          autoPlay
          loop={true}
          style={{ width: 139, height: 192 }}
        />
        <View className='flex items-center gap-1'>
          <Text className='text-streak font-bold color-dark'>{current.newValue as number}</Text>
          <Text className='text-title-1 font-semibold color-dark'>{t('streak.day')}</Text>
        </View>
        <View className='flex gap-4'>
          <WeekRecord streakRecords={streakRecords} />
          <Text className='text-center text-body font-semibold color-neutral-600'>{t('streak.congratulation')} </Text>
        </View>
      </View>
      <View className='flex gap-4'>
        <Button onPress={handleNextMilestone} size='lg'>
          <Text className='text-button text-center'>{t('button.next')}</Text>
        </Button>
      </View>
    </PlatformView>
  );
};
