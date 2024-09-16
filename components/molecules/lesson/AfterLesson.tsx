import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { SvgProps } from 'react-native-svg';

import CarrotIcon from '~/assets/images/carrot.svg';
import FlashIcon from '~/assets/images/flash.svg';
import TimerIcon from '~/assets/images/mingcute_time-line.svg';
import { Modal } from '~/components/molecules/Modal';
import { Button } from '~/components/ui/Button';
import Confetti from '~/lib/components/confentti';

import { ProgressCircle } from '../ProgressCircle';

type AfterLessonProps = {
  percent: number;
  exp: number;
  carrot: number;
  timer: Date;
  [key: string]: number | Date;
};

const data: AfterLessonProps = {
  percent: 74,
  exp: 20,
  carrot: 20,
  timer: new Date(),
};

const tickerComponents: Record<string, { Component: React.FC<SvgProps>; label: string }> = {
  exp: { Component: FlashIcon, label: 'after.Experience' },
  carrot: { Component: CarrotIcon, label: 'after.Carrot' },
  timer: { Component: TimerIcon, label: 'after.Timer' },
};

export function AfterLesson() {
  const { t } = useTranslation('lesson');
  const randomEncourage = Math.random() * Number(t('after.encourage.length'));

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  // TODO: back to previous page
  const handlePress = () => {
    router.back();
  };

  return (
    <View className='w-full'>
      <LinearGradient start={{ x: 0.5, y: 1 }} end={{ x: 0.5, y: 0 }} colors={['#3A8A7D', '#20534D']}>
        <View className='h-full w-full'>{showConfetti && <Confetti />}</View>
      </LinearGradient>
      <Modal position='bottom'>
        <View className='mb-4 mt-15 flex flex-col items-center justify-start gap-y-14'>
          <View className='flex items-center justify-center gap-y-5'>
            <ProgressCircle size={160} progress={data.percent as number} showsText />
            <Text className='text-title-2 font-bold'>{t(`after.encourage.${Math.floor(randomEncourage)}`)}</Text>
          </View>
          <View className='w-full gap-y-6'>
            <View className='flex w-full flex-row items-center justify-start gap-x-4'>
              {Object.keys(tickerComponents).map((key) => {
                const { Component, label } = tickerComponents[key];
                return (
                  <View key={key} className='flex flex-1 items-start gap-y-2 rounded bg-neutral-50 p-3'>
                    <Text>{t(label)}</Text>
                    <View className='flex-row items-center gap-x-1'>
                      <Component width={24} height={24} />
                      <View>
                        <Text className='text-title-2 font-bold'>
                          {/* TODO: update timer later */}
                          {key === 'timer' ? '1:48' : (data[key] as number)}&nbsp;
                          <Text className='text-title-4 font-medium'>{key === 'exp' ? 'xp' : ''}</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
            <Button onPress={handlePress}>
              <Text className='text-button'>{t('after.receive-reward')}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
