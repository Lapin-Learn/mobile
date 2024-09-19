import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import MultipleChoice from '~/components/molecules/exercise/MultipleChoice';
import { LoadingLesson } from '~/components/molecules/lesson/LoadingLesson';
import { useLessonQuestions } from '~/hooks/react-query/useDailyLesson';

export default function Exercise() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { data: questions, isLoading: questionsLoading } = useLessonQuestions({ lessonId });

  if (questionsLoading) {
    return <LoadingLesson />;
  }

  return (
    <View>
      <MultipleChoice data={questions} />
    </View>
  );
}
