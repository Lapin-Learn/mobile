import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import CarrotIcon from '~/assets/images/carrot.svg';
import TimerIcon from '~/assets/images/clock.svg';
import FlashIcon from '~/assets/images/flash.svg';
import { Modal } from '~/components/molecules/Modal';
import { ProgressCircle } from '~/components/molecules/ProgressCircle';
import { Button } from '~/components/ui/Button';
import { useMilestoneStore } from '~/hooks/zustand/useMilestoneStore';
import { convertSecondsToMinutes } from '~/lib/utils';

export type LessonResultProps = {
  percent: number;
  exp: number;
  carrot: number;
  timer: number;
  [key: string]: number;
};

// TODO: Remove carrot if value = 0
const tickerComponents: Record<string, { Component: React.FC<SvgProps>; label: string }> = {
  exp: { Component: FlashIcon, label: 'after.Experience' },
  carrot: { Component: CarrotIcon, label: 'after.Carrot' },
  timer: { Component: TimerIcon, label: 'after.Timer' },
};

export function LessonResult({ data }: { data: LessonResultProps }) {
  const { milestones } = useMilestoneStore();

  const { t } = useTranslation('lesson');

  const [isModalVisible, setIsModalVisible] = useState(true);

  const randomEncourage = Math.random() * Number(t('after.encourages.length'));

  useEffect(() => {
    if (!isModalVisible) {
      if (milestones.length) {
        router.replace('/milestones');
      } else {
        router.back();
      }
    }
  }, [isModalVisible, milestones.length]);

  return (
    <View className='w-full'>
      <View className='w-full'>
        <LinearGradient start={{ x: 0.5, y: 1 }} end={{ x: 0.5, y: 0 }} colors={['#3A8A7D', '#20534D']}>
          <View className='h-full w-full'>
            <LottieView
              style={{ ...StyleSheet.absoluteFillObject }}
              resizeMode='cover'
              source={require('~/assets/images/confetti.json')}
              autoPlay
              loop={true}
            />
          </View>
        </LinearGradient>

        <Modal position='bottom' visible={isModalVisible}>
          <View className='mb-4 mt-15 flex flex-col items-center justify-start gap-y-14'>
            <View className='flex items-center justify-center gap-y-5'>
              <ProgressCircle size={160} progress={data.percent as number} showsText />
              <Text className='text-title-2 font-bold'>{t(`after.encourages.${Math.floor(randomEncourage)}`)}</Text>
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
                            {key === 'timer' ? convertSecondsToMinutes(data[key] as number) : (data[key] as number)}
                            &nbsp;
                            <Text className='text-title-4 font-medium'>{key === 'exp' ? 'xp' : ''}</Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              <Button onPress={() => setIsModalVisible(false)}>
                <Text className='text-button'>{t('after.receive-reward')}</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
