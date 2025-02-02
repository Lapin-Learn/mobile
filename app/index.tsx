import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { CommonActions, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { useAccountIdentifier } from '~/hooks/react-query/useUser';
import { firestore } from '~/lib/services';

const Index = () => {
  const { isSuccess, data: account, error } = useAccountIdentifier();
  const [showScreen, setShowScreen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAppInfo = async () => {
      await firestore
        .collection('Screen')
        .doc('updateProfile')
        .get()
        .then((doc) => {
          const screen = doc.data();
          setShowScreen(screen?.show);
        });
    };

    fetchAppInfo();
  }, []);

  useEffect(() => {
    if (showScreen && (error?.message === 'User not found' || (isSuccess && !account.fullName))) {
      router.replace('/update-profile');
    } else if (isSuccess && account) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: '(tabs)' }],
        })
      );
    }
  }, [error, showScreen, isSuccess, account, navigation]);

  return null;
};

export default Index;
