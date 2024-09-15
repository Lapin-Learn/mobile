import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Random() {
  const { randomId } = useLocalSearchParams<{ randomId: string }>();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: randomId as string,
    });
  }, [navigation, randomId]);

  return (
    <SafeAreaView className='relative h-full w-full'>
      <View className='mt-12'></View>
    </SafeAreaView>
  );
}
