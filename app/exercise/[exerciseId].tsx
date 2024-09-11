import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Exercise() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  return (
    <SafeAreaView>
      <Text>{exerciseId}</Text>
    </SafeAreaView>
  );
}
