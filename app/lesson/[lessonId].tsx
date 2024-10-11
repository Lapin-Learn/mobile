import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import QuestionTemplate from '~/components/molecules/exercise/QuestionTemplate';
import { AfterLesson } from '~/components/molecules/lesson/AfterLesson';
import { LoadingLesson } from '~/components/molecules/lesson/LoadingLesson';
import { useLessonQuestions } from '~/hooks/react-query/useDailyLesson';
import { useDailyLessonQuestionStore } from '~/hooks/zustand';

export default function Lesson() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { data, isLoading, isSuccess } = useLessonQuestions({ lessonId });
  const {
    state: { currentQuestion, isCompleted, result },
    clear,
    setQuestions,
  } = useDailyLessonQuestionStore();
  const { t } = useTranslation('question');

  useEffect(() => {
    if (isSuccess && data) {
      setQuestions(
        data.questionToLessons.map((q) => q.question),
        lessonId
      );
    }
    return () => {
      clear();
    };
  }, [isSuccess, data, clear, setQuestions, lessonId]);

  if (isLoading) return <LoadingLesson />;
  if (isCompleted && result)
    return (
      <View>
        <AfterLesson data={result} />
      </View>
    );

  return (
    <View>
      {currentQuestion ? (
        <QuestionTemplate />
      ) : (
        <View className='flex h-full items-center justify-center'>
          <Text>{t('general.noQuestionFound')}</Text>
        </View>
      )}
    </View>
  );
}
