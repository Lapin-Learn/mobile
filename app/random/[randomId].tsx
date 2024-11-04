import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Text } from 'react-native';

import PlatformView from '~/components/templates/PlatformView';

const Random = () => {
  const { randomId } = useLocalSearchParams<{ randomId: string }>();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: randomId as string,
    });
  }, [navigation, randomId]);

  return (
    <PlatformView>
      <Text>Random {randomId}</Text>
    </PlatformView>
  );
};

export default Random;
