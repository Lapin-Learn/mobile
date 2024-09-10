import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Exercise() {
  const { reviewId } = useLocalSearchParams<{ reviewId: string }>();
  return (
    <SafeAreaView>
      <Text>{reviewId}</Text>
    </SafeAreaView>
  );
}
