import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '~/components/molecules/BackButton';
import MultipleChoice from '~/components/molecules/exercise/MultipleChoice';
import ProgressBar from '~/components/molecules/ProgressBar';

export default function Exercise() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  return (
    <SafeAreaView>
      <MultipleChoice />
    </SafeAreaView>
  );
}
