import { router } from 'expo-router';
import { Text, View } from 'moti';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { GLOBAL_STYLES } from '~/lib/constants';
import { SkillEnum } from '~/lib/enums';

type PopupLessonProps = {
  skill: SkillEnum;
};

export const PopupLesson = ({ skill }: PopupLessonProps) => {
  const { t } = useTranslation('translation');
  const handleExercise = () => {
    return router.push(`/exercise/${skill}`);
  };
  // const handleRandom = () => {
  //   return router.push(`/random/${skill}`);
  // };

  return (
    <View style={styles.container}>
      <View style={styles.arrow} />
      {/* TODO: skill progress */}
      {/* <View style={{}} className='relative mt-5 h-2 w-full bg-orange-200'>
        <View style={{}} className='absolute -top-5 mt-5 h-2 w-1/3 bg-orange-500' />
      </View>
      <View style={{}} className='mb-5 mt-2 flex w-full flex-row items-center justify-between'>
        <Text style={{}} className='font-ibold text-subhead text-blue-900'>{t('list.level', { level: 1 })}</Text>
        <Text style={{}} className='font-ibold text-subhead text-blue-900'>
          {t('list.progress', { current: 80, total: 2000 })}
        </Text>
      </View> */}
      <View style={styles.buttonContainer}>
        <Button onPress={handleExercise}>
          <Text style={styles.buttonText}>{t('list.exerciseButton', { xp: 25 })}</Text>
        </Button>
        {/* TODO: random exercises */}
        {/* <Button style={{}} className='bg-orange-50' onPress={handleRandom}>
          <Text style={{}} className='text-button font-isemibold text-subhead text-orange-500'>{t('list.randomButton')}</Text>
        </Button> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    ...Styles.backgroundColor.white,
  },
  arrow: {
    position: 'absolute',
    top: -8,
    height: 16,
    width: 16,
    transform: [{ rotate: '45deg' }],
    ...Styles.backgroundColor.white,
  },
  buttonText: {
    ...GLOBAL_STYLES.textButton,
    ...Styles.font.medium,
    ...Styles.fontSize.subhead,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
});
