import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { LoadingLesson } from '~/components/molecules/lesson/LoadingLesson';

export default function Exercise() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();

  return (
    <View>
      <LoadingLesson />
      {/* <AfterLesson /> */}
    </View>
  );
}
