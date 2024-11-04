import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { Text } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';
import { useMissions } from '~/hooks/react-query/useMission';
import { GLOBAL_STYLES } from '~/lib/constants';
import { IMissionMilestone } from '~/lib/types';

import { Loading } from '../Loading';
import { MissionSection } from '../mission/MissionSection';
import { MilestoneProps } from './type';

export const MissionMilestone = ({ current, handleNextMilestone }: MilestoneProps) => {
  const { t } = useTranslation('milestone');
  const { data: missions = [], isLoading } = useMissions();

  const milestone = (current.newValue as IMissionMilestone[]).map((d) => ({
    name: d.mission.quest.name,
    interval: d.mission.type,
    rewards: d.mission.quest.rewards,
    current: d.current,
    quantity: d.mission.quantity,
  }));

  if (isLoading) {
    return <Loading />;
  }

  const dailyMissions = missions?.filter((mission) => mission.interval === 'daily');
  const monthlyMission = milestone?.find((mission) => mission.interval === 'monthly');

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
