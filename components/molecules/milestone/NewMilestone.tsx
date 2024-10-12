import { Share2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Easing } from 'react-native-reanimated';

import MilestonesBackground from '~/assets/images/milestones/milestone_background.svg';
import MilestoneLevel from '~/assets/images/milestones/milestone_level.svg';
import MilestoneRank from '~/assets/images/milestones/milestone_rank.svg';
import RankIcon from '~/components/icons/RankIcon';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { Text } from '~/components/ui/Text';
import { useUserProfile } from '~/hooks/react-query/useUser';
import { MilestonesEnum, RankEnum } from '~/lib/enums';
import { ILevel } from '~/lib/types';
import { formatNumber } from '~/lib/utils';

import RadialGradientBackground from '../../templates/RadialGradientBackground';
import { MilestoneProps } from './type';

export const NewMilestone = ({ current, handleNextMilestone }: MilestoneProps) => {
  const { t } = useTranslation('milestone');
  const { data: learner } = useUserProfile();

  const rankTranslation = {
    [RankEnum.BRONZE]: t('rank.bronze'),
    [RankEnum.SILVER]: t('rank.silver'),
    [RankEnum.GOLD]: t('rank.gold'),
    [RankEnum.PLATINUM]: t('rank.platinum'),
    [RankEnum.DIAMOND]: t('rank.diamond'),
    [RankEnum.MASTER]: t('rank.master'),
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
            <View />
            <View className='flex gap-10'>
              <View className='flex w-full items-center'>
                {current.type === MilestonesEnum.LEVEL_UP ? (
                  <View className='relative flex items-center justify-center'>
                    <MilestoneLevel />
                    <Text className='absolute text-7xl font-extrabold drop-shadow-lg color-white [text-shadow:_4px_4px_4px_#D48A00]'>
                      {(current.newValue as ILevel).id}
                    </Text>
                  </View>
                ) : (
                  <View className='relative flex items-center justify-center'>
                    <MilestoneRank />
                    <RankIcon
                      name={(current.newValue as RankEnum) || RankEnum.BRONZE}
                      style={{ position: 'absolute', transform: [{ translateX: 4 }] }}
                      width={140}
                      height={140}
                    />
                  </View>
                )}
              </View>
              <Text className='text-center text-large-title font-bold'>
                {current.type === MilestonesEnum.LEVEL_UP ? t('gain-new-level') : t('gain-new-rank')}
              </Text>
              <View className='flex gap-2 px-12'>
                {current.type === MilestonesEnum.RANK_UP && (
                  <Text className='pb-1 text-center text-title-2 font-semibold'>
                    {t('rank.title')} {rankTranslation[current.newValue as RankEnum]}
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
              <Button onPress={handleNextMilestone}>
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
};
