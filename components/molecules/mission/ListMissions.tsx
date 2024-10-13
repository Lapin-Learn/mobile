import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import Carrot from '~/assets/images/carrot.svg';
import MissionIcon from '~/components/icons/MissionIcon';
import { ProfileSection as MissionSection } from '~/components/molecules/profile/ProfileSection';
import { Progress } from '~/components/ui/Progress';
import { cn } from '~/lib/utils';

import { MissionsProps } from './type';

export const ListMissions = ({ type, data }: Pick<MissionsProps, 'type' | 'data'>) => {
  const { t } = useTranslation('mission');
  return data.map((item, index) => {
    const progressValue = parseInt(item.current) / parseInt(item.target);
    const isLastItem = index === data.length - 1;

    return (
      <View key={index} className={cn(progressValue >= 1 ? 'bg-yellow-50' : '')}>
        <MissionSection.Item className='w-full gap-2 p-4'>
          <View className='grow flex-row gap-1'>
            {type === 'daily' ? <MissionIcon.Daily code={item.code} /> : <MissionIcon.Monthly code={item.code} />}
            <View className='grow flex-col gap-1'>
              <Text className='font-isemibold text-title-4'>{t(`${type}.${item.code}`)}</Text>
              <Progress
                className='h-4 rounded-xl'
                indicatorClassName='bg-orange-400'
                value={progressValue * 100}
                label={`${item.current}/${item.target}`}
              />
            </View>
          </View>
          <View className='flex-row items-center justify-center px-1'>
            <Text className='font-isemibold text-subhead text-dark'>+{item.value}</Text>
            <Carrot width={18} height={18} />
          </View>
        </MissionSection.Item>
        {!isLastItem && <View className='border-t border-neutral-100' />}
      </View>
    );
  });
};
