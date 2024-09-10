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
  const handleReview = () => {
    return router.push(`/review/${skill}`);
  };

  return (
    <View className='w-[300px] bg-white px-4 pb-3 ml-2 rounded-2xl items-center justify-center'>
      <View className='w-4 h-4 absolute bg-white -top-2.5 rotate-45' />
      <View className='relative w-full h-2 bg-orange-200 mt-5'>
        <View className='absolute w-1/3 h-2 bg-orange-500 mt-5 -top-5' />
      </View>
      <View className='w-full flex flex-row justify-between items-center mb-5 mt-2'>
        <Text className='text-blue-900 text-subhead font-bold'>{t('list.level', { level: 1 })}</Text>
        <Text className='text-blue-900 text-subhead font-bold'>{t('list.progress', { current: 80, total: 2000 })}</Text>
      </View>
      <View className='w-full gap-y-2'>
        <Button className='shadow-button' onPress={handleExercise}>
          <Text className='text-white text-subhead font-semibold'>{t('list.exerciseButton', { xp: 25 })}</Text>
        </Button>
        <Button className='bg-orange-50' onPress={handleReview}>
          <Text className='text-orange-500 text-subhead font-semibold'>{t('list.reviewButton')}</Text>
        </Button>
      </View>
    </View>
  );
}
