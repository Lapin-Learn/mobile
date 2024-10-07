import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import QuestionTemplate from '~/components/molecules/exercise/QuestionTemplate';
import { LoadingLesson } from '~/components/molecules/lesson/LoadingLesson';
import useLesson from '~/components/organisms/exercise-question/useLesson';

export default function Lesson() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { isLoading, currentQuestion, clear, ...rest } = useLesson(lessonId);
  const { t } = useTranslation('question');

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  if (isLoading) return <LoadingLesson />;

  return (
    <View>
      {currentQuestion ? (
        <QuestionTemplate lessonId={lessonId} />
      ) : (
        <View className='flex h-full items-center justify-center'>
          <Text>{t('general.noQuestionFound')}</Text>
        </View>
      )}
    </View>
  );
}
