import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import { Text } from '~/components/ui/Text';
import { useMissions } from '~/hooks/react-query/useMission';
import { IMissionMilestone } from '~/lib/types';

import { Loading } from '../Loading';
import { ListMissions } from '../mission/ListMissions';
import { MilestoneProps } from './type';

export const MissionMilestone = ({ current, handleNextMilestone }: MilestoneProps) => {
  const { t } = useTranslation('milestone');
  const { data: missions, isLoading } = useMissions();

  const milestone = (current.newValue as IMissionMilestone[]).map((d) => ({
    name: d.mission.quest.description,
    interval: d.mission.type,
    description: d.mission.quest.description,
    rewards: d.mission.quest.rewards,
    current: d.current,
    quantity: d.mission.quantity,
  }));

  console.log('missions', missions);
  console.log('milestone', milestone);

  if (isLoading) {
    return <Loading />;
  }

  const dailyMissions = missions?.filter((mission) => mission.interval === 'daily');
  const monthlyMission = milestone?.find((mission) => mission.interval === 'monthly');

  return (
    <PlatformView className='mx-4 flex h-full justify-between py-4'>
      <View />
      <View className='flex w-full items-center gap-10 px-4'>
        <Text className='font-ibold text-large-title color-primary'>{t('mission.title')}</Text>
        <View className='flex w-full items-center gap-5'>
          <ListMissions data={dailyMissions} />
          {monthlyMission && <ListMissions data={[monthlyMission]} />}
        </View>
      </View>
      <View className='flex gap-4'>
        <Button onPress={handleNextMilestone} size='lg'>
          <Text className='text-button text-center'>{t('button.next')}</Text>
        </Button>
      </View>
    </PlatformView>
  );
};
