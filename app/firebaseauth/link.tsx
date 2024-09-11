import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function FirebaseauthLinkPage() {
  useEffect(() => {
    router.back();
  }, []);

  return <View></View>;
}
