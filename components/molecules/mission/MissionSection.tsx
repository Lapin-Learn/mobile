import { Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import Carrot from '~/assets/images/carrot.svg';
import { default as MissionIcon } from '~/components/icons/MissionIcon';
import { ProfileSection as Section } from '~/components/molecules/profile/ProfileSection';
import { Progress } from '~/components/ui/Progress';
import { cn, convertMissionNameCategory, formatRemainingToDateTime } from '~/lib/utils';

import { MissionProps, MissionSectionProps } from './type';

export const MissionSection = ({ title, timeRemaining, missions }: MissionSectionProps) => {
  const { t } = useTranslation('mission');
  return (
    <Section className='px-4 pt-5'>
      {title && timeRemaining && (
        <Section.Title label={title} className='items-end' textClassName='font-isemibold text-title-2 text-black'>
          <View className='flex-row gap-x-1'>
            <Clock size={20} color='#F17D53' />
            <Text className='shrink font-imedium text-subhead text-orange-400'>
              {t('time_remaining', { time: formatRemainingToDateTime(timeRemaining) })}
            </Text>
          </View>
        </Section.Title>
      )}
      <Section.Group className='bg-white'>
        <ListMissions data={missions} />
      </Section.Group>
    </Section>
  );
};

export const ListMissions = ({ data = [] }: { data?: MissionProps[] }) => {
  return data.map((item, index) => {
    const progressValue = item.current / item.quantity;
    const isLastItem = index === data.length - 1;

    return (
      <View key={index} className={cn(progressValue >= 1 ? 'bg-yellow-100' : '')}>
        <Section.Item className='flex-0 w-full items-center justify-between gap-2 p-4'>
          <View className='flex-1 flex-row items-center gap-1'>
            <View className='h-12 w-12 overflow-hidden rounded'>
              {item.interval === 'daily' ? (
                <MissionIcon.Daily code={item.name} />
              ) : (
                <MissionIcon.Monthly code={item.name} />
              )}
            </View>
            <View className='flex-1 flex-col gap-1'>
              <Text className='font-isemibold text-title-4'>{convertMissionNameCategory(item)}</Text>
              <Progress
                className='h-4 rounded-xl'
                indicatorClassName='bg-orange-400'
                value={progressValue * 100}
                label={`${item.current}/${item.quantity}`}
              />
            </View>
          </View>
          <View className='flex-row items-center justify-center px-1'>
            <Text className='font-isemibold text-subhead text-dark'>+{item.rewards}</Text>
            <Carrot width={18} height={18} />
          </View>
        </Section.Item>
        {!isLastItem && <View className='border-t border-neutral-100' />}
      </View>
    );
  });
};
