import { router } from 'expo-router';
import { Text, View } from 'moti';
import { useTranslation } from 'react-i18next';

import { SkillEnum } from '~/enums';

import { Button } from '../ui/button';

export function PopupLesson({ skill }: { skill: SkillEnum | null }) {
  const segmentSkill =
    skill === SkillEnum.READING
      ? 'reading'
      : skill === SkillEnum.LISTENING
        ? 'listening'
        : skill === SkillEnum.WRITING
          ? 'writing'
          : 'speaking';

  const { t } = useTranslation('translation');
  const handleExercise = () => {
    return router.push(`/exercise/${segmentSkill}`);
  };
  const handleReview = () => {
    return router.push(`/review/${segmentSkill}`);
  };
  return (
    <View className='w-[300px] bg-white p-4 mt-2 ml-2 rounded-lg items-center justify-center'>
      <View className='w-4 h-4 absolute bg-white -top-2.5 rotate-45' />
      <View className='relative w-full h-2 bg-orange-200 mt-5'>
        <View className='absolute w-1/3 h-2 bg-orange-500 mt-5 -top-5' />
      </View>
      <View className='w-full flex flex-row justify-between items-center mb-5 mt-2'>
        <Text className='text-blue-900 text-subhead font-bold'>{t('list.level', { level: 1 })}</Text>
        <Text className='text-blue-900 text-subhead font-bold'>{t('list.progress', { current: 80, total: 2000 })}</Text>
      </View>
      <Button
        className='w-full bg-orange-500 shadow-button shadow-orange-700 py-3.5 px-5 rounded-none'
        onPress={handleExercise}>
        <Text className='text-white text-subhead font-semibold'>{t('list.exerciseButton', { xp: 25 })}</Text>
      </Button>
      <Button
        className='w-full bg-orange-50 shadow-button shadow-orange-700 py-3.5 px-5 rounded-none'
        onPress={handleReview}>
        <Text className='text-orange-500 text-subhead font-semibold'>{t('list.reviewButton')}</Text>
      </Button>
    </View>
  );
}
