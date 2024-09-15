import { router } from 'expo-router';
import { Text, View } from 'moti';
import { useTranslation } from 'react-i18next';

import { SkillEnum } from '~/lib/enums';

import { Button } from '../ui/Button';

export function PopupLesson({ skill }: { skill: SkillEnum }) {
  const { t } = useTranslation('translation');
  const handleExercise = () => {
    return router.push(`/exercise/${skill}`);
  };
  const handleRandom = () => {
    return router.push(`/random/${skill}`);
  };

  return (
    <View className='w-[300px] items-center justify-center rounded-2xl bg-white px-4 pb-3'>
      <View className='absolute -top-2.5 h-4 w-4 rotate-45 bg-white' />
      <View className='relative mt-5 h-2 w-full bg-orange-200'>
        <View className='absolute -top-5 mt-5 h-2 w-1/3 bg-orange-500' />
      </View>
      <View className='mb-5 mt-2 flex w-full flex-row items-center justify-between'>
        <Text className='text-subhead font-bold text-blue-900'>{t('list.level', { level: 1 })}</Text>
        <Text className='text-subhead font-bold text-blue-900'>{t('list.progress', { current: 80, total: 2000 })}</Text>
      </View>
      <View className='w-full gap-y-2'>
        <Button onPress={handleExercise}>
          <Text className='text-button text-subhead'>{t('list.exerciseButton', { xp: 25 })}</Text>
        </Button>
        <Button className='bg-orange-50' onPress={handleRandom}>
          <Text className='text-button text-subhead text-orange-500'>{t('list.randomButton')}</Text>
        </Button>
      </View>
    </View>
  );
}
