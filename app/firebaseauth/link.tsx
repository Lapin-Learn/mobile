import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

const FirebaseauthLinkPage = () => {
  useEffect(() => {
    router.back();
  }, []);

  return <View></View>;
};

export default FirebaseauthLinkPage;
