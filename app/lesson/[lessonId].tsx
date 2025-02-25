import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Loading } from '~/components/molecules/Loading';
import QuestionTemplate from '~/components/organisms/exercise/QuestionTemplate';
import { LessonResult } from '~/components/organisms/lesson/LessonResult';
import PlatformView from '~/components/templates/PlatformView';
import { useLessonQuestions } from '~/hooks/react-query/useDailyLesson';
import { useDailyLessonQuestionStore } from '~/hooks/zustand';

const Lesson = () => {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { data, isLoading, isSuccess } = useLessonQuestions({ lessonId });
  const {
    state: { currentQuestion, isCompleted, result, totalQuestion, currentQuestionIndex, isPendingMutation },
    clear,
    setQuestions,
    mutation,
  } = useDailyLessonQuestionStore();
  const { t } = useTranslation('question');

  useEffect(() => {
    if (isCompleted && currentQuestionIndex === totalQuestion - 1) {
      mutation();
    }
  }, [isCompleted]);

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
  if (isPendingMutation) {
    return (
      <PlatformView>
        <Loading />
      </PlatformView>
    );
  }

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
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Lesson;
