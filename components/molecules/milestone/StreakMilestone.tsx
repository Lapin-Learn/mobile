import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import MilestoneStreak from '~/assets/images/milestones/milestone_streak.svg';
import StreakIcon from '~/components/icons/StreakIcon';
import { Button } from '~/components/ui/Button';
import { Text } from '~/components/ui/Text';

import PlatformView from '../PlatformView';
import { MilestoneProps } from './type';

const WeekRecord = ({ doneRecords }: { doneRecords: string[] }) => {
  const weekMap = getCurrentWeekBooleanObject(doneRecords);

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

  const mockDoneRecords = ['2024/10/2', '2024/10/3', '2024/10/5'];

  return (
    <PlatformView className='mx-4 flex h-full justify-between py-4'>
      <View />
      <View className='flex w-full items-center gap-6 px-4'>
        <MilestoneStreak />
        <View className='flex items-center gap-1'>
          <Text className='text-streak font-bold color-dark'>{current.newValue as number}</Text>
          <Text className='text-title-1 font-semibold color-dark'>{t('streak.day')}</Text>
        </View>
        <View className='flex gap-4'>
          <WeekRecord doneRecords={mockDoneRecords} />
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

function getCurrentWeekBooleanObject(doneRecords: string[]): Record<string, boolean | undefined> {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDay); // Set to the start of the week (Sunday)

  const weekBooleanObject: Record<string, boolean | undefined> = {};

  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(startOfWeek);
    weekDate.setDate(startOfWeek.getDate() + i);
    const formattedDate = `${weekDate.getFullYear()}/${weekDate.getMonth() + 1}/${weekDate.getDate()}`;
    if (weekDate > currentDate) {
      weekBooleanObject[dayNames[i]] = undefined;
    } else {
      weekBooleanObject[dayNames[i]] = doneRecords.includes(formattedDate);
    }
  }

  return weekBooleanObject;
}
