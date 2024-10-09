import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import StreakIcon from '~/components/icons/StreakIcon';
import { Button } from '~/components/ui/Button';
import { Text } from '~/components/ui/Text';
import { useHistoryStreak } from '~/hooks/react-query/useStreak';

import { Loading } from '../Loading';
import PlatformView from '../PlatformView';
import { MilestoneProps } from './type';

const WeekRecord = ({ streakRecords }: { readonly streakRecords: string[] }) => {
  const weekMap = getCurrentWeekBooleanObject(streakRecords);

  return (
    <View className='flex flex-row gap-4'>
      {Object.keys(weekMap).map((date, index) => (
        <View key={index} className='flex flex-col items-center justify-center gap-1'>
          <Text className='text-body font-semibold color-neutral-200'>{date[0].toUpperCase()}</Text>
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
  const { data, isPending } = useHistoryStreak({ start: '0' });

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

function formatDate(date: Date): string {
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}

function getCurrentWeekBooleanObject(doneRecords: string[]): Record<string, boolean | undefined> {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDay); // Set to the start of the week (Sunday)

  const weekBooleanObject: Record<string, boolean | undefined> = {};

  const doneRecordsSet = new Set(doneRecords.map((record) => formatDate(new Date(record))));

  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(startOfWeek);
    weekDate.setDate(startOfWeek.getDate() + i);
    const formattedDate = formatDate(weekDate);
    if (weekDate > currentDate) {
      weekBooleanObject[dayNames[i]] = undefined;
    } else {
      weekBooleanObject[dayNames[i]] = doneRecordsSet.has(formattedDate);
    }
  }

  return weekBooleanObject;
}
