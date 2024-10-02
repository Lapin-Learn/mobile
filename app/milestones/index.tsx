import { MotiView } from 'moti';
import { View } from 'react-native';
import RadialGradientBackground from '~/components/molecules/RadialGradient';

import { router } from 'expo-router';
import { Share2 } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Easing } from 'react-native-reanimated';
import MilestonesBackground from '~/assets/images/background_milestone.svg';
import MilestoneLevel from '~/assets/images/milestone_level.svg';
import MilestoneRank from '~/assets/images/milestone_rank.svg';
import RankIcon from '~/components/icons/RankIcon';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { Text } from '~/components/ui/Text';
import { useUserProfile } from '~/hooks/react-query/useUser';
import { useGameStore } from '~/hooks/zustand';
import { MilestonesEnum, RankEnum } from '~/lib/enums';
import { ILevel } from '~/lib/interfaces';
import { formatNumber } from '~/lib/utils';

export default function Milestones() {
  const { resetGame, milestones } = useGameStore();
  // const { resetGame } = useGameStore();
  const { t } = useTranslation('lesson');
  const { data: learner } = useUserProfile();

  const [currentMillstone, setCurrentMillstone] = useState(0);

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
  const rankTranslation = {
    [RankEnum.BRONZE]: t('rank.bronze'),
    [RankEnum.SILVER]: t('rank.silver'),
    [RankEnum.GOLD]: t('rank.gold'),
    [RankEnum.PLATINUM]: t('rank.platinum'),
    [RankEnum.DIAMOND]: t('rank.diamond'),
    [RankEnum.MASTER]: t('rank.master'),
  };

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
              easing: Easing.linear,
            }}>
            <MilestonesBackground />
          </MotiView>
          <View className='absolute flex h-full w-full justify-between px-4 pb-4'>
            <View></View>
            <View className='flex gap-10'>
              <View className='flex w-full items-center'>
                {milestones[currentMillstone].type === MilestonesEnum.LEVEL_UP ? (
                  <View className='relative flex items-center justify-center'>
                    <MilestoneLevel />
                    {/*TODO: Drop shadow effect for text*/}
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
                    {formatNumber(learner?.learnerProfile.xp || 0)}/
                    {formatNumber(learner?.learnerProfile.level.xp || 0)} {t('level.xp')}
                  </Text>
                </View>
              </View>
            </View>
            <View className='flex gap-4'>
              <Button onPress={handleNextMillstone}>
                <Text className='text-button text-center'>{t('button.next')}</Text>
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
    </View>
  );
}
