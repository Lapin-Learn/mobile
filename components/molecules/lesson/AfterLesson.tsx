import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Share2 } from 'lucide-react-native';
import { MotiView } from 'moti';
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
import RankIcon from '~/components/icons/RankIcon';
import { Modal } from '~/components/molecules/Modal';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { useUserProfile } from '~/hooks/react-query/useUser';
import { useGameStore } from '~/hooks/zustand';
import Confetti from '~/lib/components/confentti';
import { MilestonesEnum, RankEnum } from '~/lib/enums';
import { ILevel } from '~/lib/interfaces';
import { convertSecondsToMinutes, formatNumber } from '~/lib/utils';

import { ProgressCircle } from '../ProgressCircle';
import RadialGradientBackground from '../RadialGradient';

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
  const { data: learner } = useUserProfile();

  const [showConfetti, setShowConfetti] = useState(false);
  const [showMillstones, setShowMillstones] = useState(false);
  const [currentMillstone, setCurrentMillstone] = useState(0);

  const randomEncourage = Math.random() * Number(t('after.encourages.length'));
  const rankTranslation = {
    [RankEnum.BRONZE]: t('rank.bronze'),
    [RankEnum.SILVER]: t('rank.silver'),
    [RankEnum.GOLD]: t('rank.gold'),
    [RankEnum.PLATINUM]: t('rank.platinum'),
    [RankEnum.DIAMOND]: t('rank.diamond'),
    [RankEnum.MASTER]: t('rank.master'),
  };

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

  const handleReceiveReward = () => {
    if (milestones.length) {
      setShowMillstones(true);
    } else {
      handleBack();
    }
  };

  return (
    <View className='w-full'>
      {showMillstones ? (
        <RadialGradientBackground>
          <View className='relative flex h-full items-center'>
            <MotiView
              className='absolute -bottom-32 flex items-center'
              from={{
                rotate: '0deg',
              }}
              animate={{
                rotate: '360deg',
              }}
              transition={{
                loop: true,
                repeatReverse: false,
                type: 'timing',
                duration: 2000,
              }}>
              <RadialBackground />
            </MotiView>
            <View className='absolute flex h-full w-full justify-between px-4 pb-4'>
              <View></View>
              <View className='flex gap-10'>
                <View className='flex w-full items-center'>
                  {milestones[currentMillstone].type === MilestonesEnum.LEVEL_UP ? (
                    <View className='relative flex items-center justify-center'>
                      <MilestoneLevel />
                      <Text className='absolute text-7xl font-extrabold drop-shadow-lg color-white'>
                        {(milestones[currentMillstone].newValue as ILevel).id}
                      </Text>
                    </View>
                  ) : (
                    <View className='relative flex items-center justify-center'>
                      <MilestoneRank />
                      <RankIcon
                        name={(milestones[currentMillstone].newValue as RankEnum) || RankEnum.BRONZE}
                        style={{ position: 'absolute', transform: [{ translateX: 4 }] }}
                        width={140}
                        height={140}
                      />
                    </View>
                  )}
                </View>
                <Text className='text-center text-large-title font-bold'>
                  {milestones[currentMillstone].type === MilestonesEnum.LEVEL_UP
                    ? t('gain-new-level')
                    : t('gain-new-rank')}
                </Text>
                <View className='flex gap-2 px-12'>
                  {milestones[currentMillstone].type === MilestonesEnum.RANK_UP && (
                    <Text className='pb-1 text-center text-title-2 font-semibold'>
                      {t('rank.title')} {rankTranslation[milestones[currentMillstone].newValue as RankEnum]}
                    </Text>
                  )}
                  <Progress
                    value={((learner?.learnerProfile.xp || 0) / (learner?.learnerProfile.level.xp || 1)) * 100}
                    className='h-5 bg-[#F5CA98]'
                    indicatorClassName='rounded-full'
                  />
                  <View className='flex flex-row justify-between'>
                    <Text className='text-body font-semibold'>Level {learner?.learnerProfile.levelId}</Text>
                    <Text className='text-body font-semibold'>
                      {formatNumber(learner?.learnerProfile.xp || 0)} {t('level.xp')}/
                      {formatNumber(learner?.learnerProfile.level.xp || 0)} {t('level.xp')}
                    </Text>
                  </View>
                </View>
              </View>
              <View className='flex gap-4'>
                <Button onPress={handleNextMillstone}>
                  <Text className='text-button'>{t('button.next')}</Text>
                </Button>
                <Button variant='ghost' size='md' className='flex-row gap-2'>
                  <Share2 width={24} height={24} color='#EE5D28' />
                  {/* TODO: share social*/}
                  <Text className='text-body font-bold text-primary'>{t('button.share')}</Text>
                </Button>
              </View>
            </View>
          </View>
        </RadialGradientBackground>
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
                <Button onPress={handleReceiveReward}>
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
