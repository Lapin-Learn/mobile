import { NativeModules, Platform } from 'react-native';
import SharedGroupPreferences from 'react-native-shared-group-preferences';

const group = 'group.streak';
export const SharedStorage = NativeModules.SharedStorage;

const useStreakWidget = () => {
  const sendStreakToSharedStorage = async (streak: string) => {
    //TODO: Implement iOS Widget, for now, the code below will throw an error
    try {
      // iOS
      await SharedGroupPreferences.setItem('widgetKey', { text: streak }, group);
    } catch (error) {
      console.log('Error setting widget data', error);
    }

    // Android
    if (Platform.OS === 'android') {
      SharedStorage.set(JSON.stringify({ text: streak }));
    }
  };

  return {
    sendStreakToSharedStorage,
  };
};

export default useStreakWidget;
