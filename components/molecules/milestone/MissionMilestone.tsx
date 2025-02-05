import uniqBy from 'lodash.uniqby';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { Text } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';
import { useMissions } from '~/hooks/react-query/useMission';
import { GLOBAL_STYLES } from '~/lib/constants';
import { IMissionMilestone } from '~/lib/types';
import { parseMission } from '~/services/axios/mission';

import { Loading } from '../Loading';
import { MissionSection } from '../mission/MissionSection';
import { MilestoneProps } from './type';

export const MissionMilestone = ({ current, handleNextMilestone }: MilestoneProps) => {
  const { t } = useTranslation('milestone');
  const { data: missions = [], isLoading } = useMissions();

  const milestone =
    (current.newValue as IMissionMilestone[]).map((d) => {
      const { rewards, requirements, category, quantity } = d.mission.quest;
      return parseMission({
        interval: d.mission.type,
        rewards,
        current: d.current,
        quantity: quantity,
        requirements,
        category,
        missionId: d.missionId,
        status: d.status,
        questId: d.mission.quest.id,
      });
    }) ?? [];

  if (isLoading) {
    return <Loading />;
  }

  const combinedMissions = uniqBy(
    [...milestone.filter((m) => m.interval === 'daily'), ...(missions ?? [])],
    'missionId'
  );

  const dailyMissions = combinedMissions.filter((mission) => mission.interval === 'daily');
  const monthlyMission = combinedMissions.find((mission) => mission.interval === 'monthly');

  return (
    <PlatformView
      style={{
        justifyContent: 'space-between',
        paddingVertical: 16,
      }}>
      <View />
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          gap: 40,
        }}>
        <Text
          style={{
            ...Styles.font.bold,
            ...Styles.fontSize['large-title'],
            ...Styles.color.primary,
            textAlign: 'center',
            paddingHorizontal: 16,
          }}>
          {t('mission.title')}
        </Text>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}>
          <MissionSection missions={dailyMissions} />
          {monthlyMission && <MissionSection missions={[monthlyMission]} />}
        </View>
      </View>
      <View
        style={{
          margin: 16,
          gap: 16,
        }}>
        <Button onPress={handleNextMilestone} size='lg'>
          <Text style={[{ textAlign: 'center' }, GLOBAL_STYLES.textButton]}>{t('button.next')}</Text>
        </Button>
      </View>
    </PlatformView>
  );
};
