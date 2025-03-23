import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';

import { useAccountIdentifier } from '~/hooks/react-query/useUser';
import { firestore } from '~/lib/services';

const Index = () => {
  const { isSuccess, data: account, error, isError } = useAccountIdentifier();
  const [showScreen, setShowScreen] = useState(false);

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
    if (showScreen && (error?.message === 'User not found' || (isSuccess && !account?.fullName))) {
      router.replace('/update-profile');
    } else if (isSuccess && account) {
      router.replace('/(tabs)');
    }
  }, [error, showScreen, isSuccess, account]);

  if (isError || (isSuccess && !account)) {
    return <Redirect href='/auth/sign-in' />;
  }

  return null;
};

export default Index;
