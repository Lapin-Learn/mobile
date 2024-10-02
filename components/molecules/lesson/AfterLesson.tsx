import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Share2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import RadialBackground from '~/assets/images/background_milestone.svg';
import CarrotIcon from '~/assets/images/carrot.svg';
import FlashIcon from '~/assets/images/flash.svg';
import MilestoneLevel from '~/assets/images/milestone_level.svg';
import MilestoneRank from '~/assets/images/milestone_rank.svg';
import TimerIcon from '~/assets/images/mingcute_time-line.svg';
import { Modal } from '~/components/molecules/Modal';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { useGameStore } from '~/hooks/zustand';
import Confetti from '~/lib/components/confentti';
import { MilestonesEnum } from '~/lib/enums';
import { ILevel } from '~/lib/interfaces';
import { convertSecondsToMinutes } from '~/lib/utils';

import { ProgressCircle } from '../ProgressCircle';

export type AfterLessonProps = {
  percent: number;
  exp: number;
  carrot: number;
  timer: number;
  [key: string]: number;
};

const tickerComponents: Record<string, { Component: React.FC<SvgProps>; label: string }> = {
  exp: { Component: FlashIcon, label: 'after.Experience' },
  carrot: { Component: CarrotIcon, label: 'after.Carrot' },
  timer: { Component: TimerIcon, label: 'after.Timer' },
};

export function AfterLesson({ data }: { data: AfterLessonProps }) {
  const { resetGame, milestones } = useGameStore();
  // To test the component
  // const milestones: IMilestone[] = [
  //   {
  //     type: MilestonesEnum.LEVEL_UP,
  //     newValue: {
  //       id: 3,
  //       xp: 300,
  //     },
  //   },
  //   {
  //     type: MilestonesEnum.RANK_UP,
  //     newValue: RankEnum.GOLD,
  //   },
  // ];
  const { t } = useTranslation('lesson');
  const randomEncourage = Math.random() * Number(t('after.encourages.length'));

  const [showConfetti, setShowConfetti] = useState(false);
  const [showMillstones, setShowMillstones] = useState(false);
  const [currentMillstone, setCurrentMillstone] = useState(0);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const handleBack = () => {
    resetGame();
    router.back();
  };

  const handleNextMillstone = () => {
    if (currentMillstone < milestones.length - 1) {
      setCurrentMillstone((prev) => prev + 1);
    } else {
      handleBack();
    }
  };

  return (
    <View className='w-full'>
      {showMillstones ? (
        // TODO: Change to radial gradient
        <LinearGradient
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          colors={['#FEFAF2', '#FFEFC6']}
          className='relative h-full'>
          {/* TODO: center and animate spinner background*/}
          <RadialBackground style={{ margin: 'auto' }} />
          {/* TODO: check gap is enough? */}
          <View className='absolute left-0 right-0 ml-auto mr-auto flex w-full gap-56 px-4 pb-16 pt-36'>
            <View className='flex gap-10'>
              <View className='flex w-full items-center'>
                {milestones[currentMillstone].type === MilestonesEnum.LEVEL_UP ? (
                  <View className='relative'>
                    <MilestoneLevel />
                    {milestones[currentMillstone].type === MilestonesEnum.LEVEL_UP && (
                      <Text className='absolute left-0 right-0 ml-auto mr-auto text-6xl font-extrabold color-black'>
                        {(milestones[currentMillstone].newValue as ILevel).id}
                      </Text>
                    )}
                  </View>
                ) : (
                  // TODO: Add rank icon
                  <MilestoneRank />
                )}
              </View>
              <Text className='text-center text-large-title font-bold'>
                {/* TODO: i18n */}
                {milestones[currentMillstone].type === MilestonesEnum.LEVEL_UP ? 'Thăng cấp' : 'Thăng hạng'}
              </Text>
              <View className='flex gap-2 px-12'>
                {/* TODO: add rank title if rank up */}
                <Progress value={10} className='h-5 bg-[#F5CA98]' />
                <View className='flex flex-row justify-between'>
                  <Text className='text-body font-semibold'>
                    Level {(milestones[currentMillstone].newValue as ILevel).id}
                  </Text>
                  {/* TODO: i18n and get real value*/}
                  <Text className='text-body font-semibold'>89.5K/101K XP</Text>
                </View>
              </View>
            </View>
            <View className='flex gap-4'>
              <Button onPress={handleNextMillstone}>
                {/* TODO: i18n */}
                <Text className='text-button'>Tiếp tục</Text>
              </Button>
              <Button variant='ghost' size='md' className='flex-row gap-2'>
                <Share2 width={24} height={24} color='#EE5D28' />
                {/* TODO: i18n and share social*/}
                <Text className='text-body font-bold text-primary'>Chia sẻ</Text>
              </Button>
            </View>
          </View>
        </LinearGradient>
      ) : (
        <View className='w-full'>
          <LinearGradient start={{ x: 0.5, y: 1 }} end={{ x: 0.5, y: 0 }} colors={['#3A8A7D', '#20534D']}>
            <View className='h-full w-full'>{showConfetti && <Confetti />}</View>
          </LinearGradient>
          <Modal position='bottom'>
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
                <Button
                  onPress={() => {
                    milestones.length ? setShowMillstones(true) : handleBack();
                  }}>
                  <Text className='text-button'>{t('after.receive-reward')}</Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
}
