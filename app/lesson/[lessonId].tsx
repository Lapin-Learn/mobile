import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import MultipleChoice from '~/components/molecules/exercise/MultipleChoice';
import { LoadingLesson } from '~/components/molecules/lesson/LoadingLesson';
import { useLessonQuestions } from '~/hooks/react-query/useDailyLesson';
import { ContentTypeEnum } from '~/lib/enums';
import { IQuestion } from '~/lib/interfaces';

export default function Exercise() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { data: questions, isLoading: questionsLoading } = useLessonQuestions({ lessonId: Number(lessonId) });

  if (questionsLoading) {
    return <LoadingLesson />;
  }

  const questionData: IQuestion[] =
    questions?.questionToLessons.map((lessonQuestion) => {
      return lessonQuestion.question;
    }) ?? [];

  return (
    <View>
      {questionData[0].contentType === ContentTypeEnum.MULTIPLE_CHOICE && (
        <MultipleChoice lesson={Number(lessonId)} data={questionData} />
      )}
    </View>
  );
}
