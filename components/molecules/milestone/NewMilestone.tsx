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
import Styles from '~/constants/GlobalStyles';
import { useGameProfile } from '~/hooks/react-query/useUser';
import { useShare } from '~/hooks/useShare';
import { GLOBAL_STYLES } from '~/lib/constants';
import { MilestonesEnum, RankEnum } from '~/lib/enums';
import { ILevel } from '~/lib/types';
import { formatNumber } from '~/lib/utils';

import RadialGradientBackground from '../../templates/RadialGradientBackground';
import { Loading } from '../Loading';
import { MilestoneProps } from './type';

export const NewMilestone = ({ current, handleNextMilestone }: MilestoneProps) => {
  const { t } = useTranslation('milestone');
  const { data: learner, isFetching } = useGameProfile();
  const { handleShare } = useShare();

  const rankTranslation = {
    [RankEnum.BRONZE]: t('rank.bronze'),
    [RankEnum.SILVER]: t('rank.silver'),
    [RankEnum.GOLD]: t('rank.gold'),
    [RankEnum.PLATINUM]: t('rank.platinum'),
    [RankEnum.DIAMOND]: t('rank.diamond'),
    [RankEnum.MASTER]: t('rank.master'),
  };

  if (isFetching) {
    return <Loading />;
  }

  return (
    <View style={{ width: '100%' }}>
      <RadialGradientBackground>
        <View style={{ position: 'relative', display: 'flex', height: '100%', alignItems: 'center' }}>
          <MotiView
            style={{ position: 'absolute', bottom: -128, alignItems: 'center' }}
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{
              loop: true,
              repeatReverse: false,
              type: 'timing',
              duration: 2000,
              easing: Easing.linear,
            }}>
            <MilestonesBackground />
          </MotiView>
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}>
            <View />
            <View style={{ gap: 40 }}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                {current.type === MilestonesEnum.LEVEL_UP ? (
                  <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                    <MilestoneLevel />
                    <Text
                      style={{
                        position: 'absolute',
                        fontSize: 64,
                        lineHeight: 64,
                        ...Styles.font.extrabold,
                        ...Styles.color.white,
                        textShadowColor: '#D48A00',
                        textShadowOffset: { width: 4, height: 4 },
                        textShadowRadius: 4,
                      }}>
                      {(current.newValue as ILevel).id}
                    </Text>
                  </View>
                ) : (
                  <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
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
              <Text style={{ textAlign: 'center', ...Styles.font.bold, ...Styles.fontSize['large-title'] }}>
                {current.type === MilestonesEnum.LEVEL_UP ? t('gain-new-level') : t('gain-new-rank')}
              </Text>
              <View style={{ gap: 8, paddingHorizontal: 48 }}>
                {current.type === MilestonesEnum.RANK_UP && (
                  <Text
                    style={{
                      paddingBottom: 4,
                      textAlign: 'center',
                      ...Styles.font.semibold,
                      ...Styles.fontSize['title-2'],
                    }}>
                    {t('rank.title')} {rankTranslation[current.newValue as RankEnum]}
                  </Text>
                )}
                <Progress
                  value={((learner?.xp || 0) / (learner?.level.xp || 1)) * 100}
                  style={{ height: 20, backgroundColor: '#F5CA98' }}
                  indicatorStyle={{ borderRadius: 999 }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ ...Styles.font.semibold, ...Styles.fontSize.body }}>Level {learner?.level.id}</Text>
                  <Text style={{ ...Styles.font.semibold, ...Styles.fontSize.body }}>
                    {formatNumber(learner?.xp || 0)}/{formatNumber(learner?.level.xp || 0)} {t('level.xp')}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ gap: 16 }}>
              <Button onPress={handleNextMilestone}>
                <Text style={GLOBAL_STYLES.textButton}>{t('button.next')}</Text>
              </Button>
              {current.type === MilestonesEnum.RANK_UP && (
                <Button
                  variant='ghost'
                  size='md'
                  style={{ display: 'flex', flexDirection: 'row', gap: 8 }}
                  onPress={() => handleShare(current.newValue as RankEnum)}>
                  <Share2 width={24} height={24} color='#EE5D28' />
                  <Text style={{ ...Styles.font.semibold, ...Styles.fontSize.body, ...Styles.color.dark }}>
                    {t('button.share')}
                  </Text>
                </Button>
              )}
            </View>
          </View>
        </View>
      </RadialGradientBackground>
    </View>
  );
};
