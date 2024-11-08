import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Loading } from '~/components/molecules/Loading';
import QuestionTemplate from '~/components/organisms/exercise/QuestionTemplate';
import { LessonResult } from '~/components/organisms/lesson/LessonResult';
import { useLessonQuestions } from '~/hooks/react-query/useDailyLesson';
import { useDailyLessonQuestionStore } from '~/hooks/zustand';

const Lesson = () => {
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

  if (isLoading || currentQuestion === null) return <Loading />;
  if (isCompleted && result)
    return (
      <View>
        <LessonResult data={result} />
      </View>
    );

  return (
    <View>
      {currentQuestion ? (
        <QuestionTemplate />
      ) : (
        <View style={styles.noQuestionFoundContainer}>
          <Text>{t('general.noQuestionFound')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noQuestionFoundContainer: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Lesson;
