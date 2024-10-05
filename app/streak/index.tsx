import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Loading } from '~/components/molecules/Loading';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import PlatformView from '~/components/molecules/PlatformView';
import { TargetStreak } from '~/components/molecules/TargetStreak';
import { useGameProfile } from '~/hooks/react-query/useUser';
import { cn } from '~/lib/utils';

export function generateTarget(days: number): { value: number; active: boolean }[] {
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
}

export default function Streak() {
  const { t } = useTranslation();
  const { data, isFetching } = useGameProfile();

  const textStyle = data?.streak.current === 0 ? 'text-[#849EBC]' : 'text-blue';
  const isLongestStreak = data?.streak.current === data?.streak.record;

  if (isFetching) return <Loading />;

  return (
    <PlatformView>
      <NavigationBar headerTitle={'Streak'} headerLeftShown />
      <View className='m-8 flex gap-y-8'>
        <View className='flex flex-row items-end justify-between'>
          <View className='gap-y-1'>
            <View className='gap-y-1'>
              <Text className={cn('text-streak font-extrabold', textStyle)}>{data?.streak.current}</Text>
              <Text className={cn('text-title-2 font-semibold', textStyle)}>{t('streak.days')}</Text>
            </View>
            <Text className='text-caption-1 font-semibold text-dark'>
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
              <View className='h-full w-full items-center justify-center'>
                <Text className='text-title-2 font-semibold text-white'>{value}</Text>
              </View>
            </TargetStreak>
          ))}
        </View>
      </View>
      <View className='mx-4 gap-y-4'>
        <Text className='text-title-2 font-semibold'>{t('streak.schedule')}</Text>
        {/* TODO: Schedule component */}
      </View>
    </PlatformView>
  );
}
