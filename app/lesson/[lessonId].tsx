import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, Text } from 'react-native';

import MultipleChoice from '~/components/molecules/exercise/MultipleChoice';
import MultipleChoices from '~/components/molecules/exercise/MultipleChoices';
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

  const renderQuestionComponent = (contentType: string) => {
    switch (contentType) {
      case ContentTypeEnum.MULTIPLE_CHOICE:
        return <MultipleChoice lesson={Number(lessonId)} data={questionData} />;
      case ContentTypeEnum.MULTIPLE_CHOICES:
        return <MultipleChoices lesson={Number(lessonId)} data={questionData} />;
      default:
        return <Text>Unsupported question type</Text>;
    }
  };

  return (
    <SafeAreaView>
      {questionData.length > 0 ? (
        renderQuestionComponent(questionData[0].contentType)
      ) : (
        <Text>No questions available</Text>
      )}
    </SafeAreaView>
  );
}
