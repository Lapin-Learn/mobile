import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Exercise() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();

  return (
    <SafeAreaView>
      {/* <LoadingLesson /> */}
      {/* <AfterLesson /> */}
    </SafeAreaView>
  );
}
