import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import QuestionTemplate from '~/components/molecules/exercise/QuestionTemplate';
import { LoadingLesson } from '~/components/molecules/lesson/LoadingLesson';
import { useLessonQuestions } from '~/hooks/react-query/useDailyLesson';
import { IQuestion } from '~/lib/interfaces';

export default function Lesson() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { data: questions, isLoading: questionsLoading } = useLessonQuestions({ lessonId: Number(lessonId) });
  const { t } = useTranslation('question');

  if (questionsLoading) {
    return <LoadingLesson />;
  }

  const questionData: IQuestion[] =
    questions?.questionToLessons.map((lessonQuestion) => {
      return lessonQuestion.question;
    }) ?? [];

  return (
    <View>
      {questionData.length > 0 ? (
        <QuestionTemplate contentType={questionData[0].contentType} data={questionData} lesson={Number(lessonId)} />
      ) : (
        <View className='flex justify-center items-center h-full'>
          <Text>{t('general.noQuestionFound')}</Text>
        </View>
      )}
    </View>
  );
}
