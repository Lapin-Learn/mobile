import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { LoadingLesson } from '~/components/molecules/lesson/LoadingLesson';

export default function Exercise() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  return (
    <View>
      <LoadingLesson />
    </View>
  );
}
