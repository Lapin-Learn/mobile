import { useEffect } from 'react';
import { NativeModules, Text, View } from 'react-native';
import SharedGroupPreferences from 'react-native-shared-group-preferences';

import { useGameProfile } from '~/hooks/react-query/useUser';

const group = 'group.streak';
const SharedStorage = NativeModules.SharedStorage;

export default function StreakWidget() {
  const { data, isFetching, error } = useGameProfile();

  useEffect(() => {
    if (data) {
      sendStreakToSharedStorage(data.streak.current);
    }
  }, [data]);

  if (isFetching) return null;

  if (error) {
    return <Text>{error.message}</Text>;
  }

  if (!data) return null;

  async function sendStreakToSharedStorage(streak: number) {
    const widgetData = {
      text: streak,
    };

    //TODO: Implement iOS Widget, for now, the code below will throw an error
    try {
      // iOS
      await SharedGroupPreferences.setItem('widgetKey', widgetData, group);
    } catch (error) {
      console.log('Error setting widget data', error);
    }

    // Android
    const value = `${streak}`;
    SharedStorage.set(JSON.stringify({ text: value }));
  }

  return <View></View>;
}
