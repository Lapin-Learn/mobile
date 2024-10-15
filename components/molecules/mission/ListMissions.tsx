import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import Carrot from '~/assets/images/carrot.svg';
import MissionIcon from '~/components/icons/MissionIcon';
import { ProfileSection as MissionSection } from '~/components/molecules/profile/ProfileSection';
import { Progress } from '~/components/ui/Progress';

import { MissionProps } from './type';

export const ListMissions = ({ data }: { data: MissionProps[] }) => {
  const { t } = useTranslation('mission');
  return data?.map((item, index) => {
    const progressValue = item.current / item.quantity;
    const isLastItem = index === data.length - 1;

    return (
      <View key={index}>
        {progressValue >= 1 && (
          <MotiView
            from={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              type: 'timing',
              duration: 2000,
            }}
            className='absolute h-full w-full bg-yellow-100'
          />
        )}
        <MissionSection.Item className='w-full gap-2 p-4'>
          <View className='grow flex-row gap-1'>
            {item.interval === 'daily' ? (
              <MissionIcon.Daily code={item.name} />
            ) : (
              <MissionIcon.Monthly code={item.name} />
            )}
            <View className='grow flex-col gap-1'>
              <Text className='font-isemibold text-title-4'>{t(`${item.interval}.${item.name}`)}</Text>
              <Progress
                className='h-4 rounded-xl'
                indicatorClassName='bg-orange-400'
                value={progressValue * 100}
                label={`${item.current}/${item.quantity}`}
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
