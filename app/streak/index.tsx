import { startOfMonth, subMonths } from 'date-fns';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text, View } from 'react-native';

import CustomCalendar from '~/components/molecules/custom-calendar';
import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { TargetStreak } from '~/components/molecules/TargetStreak';
import PlatformView from '~/components/templates/PlatformView';
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

  const textStyle = data?.streak.current === 0 ? 'text-[#849EBC]' : 'text-blue';
  const isLongestStreak = data?.streak.current === data?.streak.record;
  if (isFetching) return <Loading />;

  return (
    <>
      <PlatformView className='flex-1 bg-[#E7F4FE]'>
        <NavigationBar headerTitle={'Streak'} headerLeftShown />
        <View className='flex gap-y-8 px-8 pb-4'>
          <View className='flex flex-row items-end justify-between'>
            <View className='gap-y-1'>
              <View className='gap-y-1'>
                <Text className={`font-iextrabold text-streak ${textStyle}`}>{data?.streak.current}</Text>
                <Text className={`font-isemibold text-title-2 ${textStyle}`}>{t('streak.days')}</Text>
              </View>
              <Text className='font-isemibold text-caption-1 text-dark'>
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
          <View className='flex flex-row items-center justify-between'>
            {generateTarget(data?.streak.current ?? 0).map(({ value, active }, index) => (
              <TargetStreak key={index} width={74} height={80} active={active}>
                <View className='h-full w-full items-center justify-center '>
                  <Text className='font-isemibold text-title-2 text-white'>{value}</Text>
                </View>
              </TargetStreak>
            ))}
          </View>
        </View>
        <View className='flex flex-1 grow gap-y-4 bg-background px-4 pt-4'>
          <Text className='font-isemibold text-title-2'>{t('streak.schedule')}</Text>
          <CustomCalendar activeDays={(streakDays ?? []).map((day) => new Date(day.date))} />
        </View>
      </PlatformView>
      <SafeAreaView className='flex-0 bg-background' />
    </>
  );
};

export default Streak;
