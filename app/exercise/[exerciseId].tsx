import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { AfterLesson } from '~/components/molecules/lesson/AfterLesson';

export default function Exercise() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();

  return (
    <View>
      {/* <LoadingLesson /> */}
      <AfterLesson />
    </View>
  );
}
