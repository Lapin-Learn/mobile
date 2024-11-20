import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { CommonActions, useNavigation } from '@react-navigation/native';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

import { Loading } from '~/components/molecules/Loading';
import { useAccountIdentifier } from '~/hooks/react-query/useUser';
import { useAuth } from '~/hooks/zustand';

const CustomRedirect = () => {
  const { isSuccess, data: account, isError } = useAccountIdentifier();
  const navigation = useNavigation();

  useEffect(() => {
    if (isSuccess && account) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: '(tabs)' }],
        })
      );
    }
  }, [isSuccess, account, navigation]);

  if (isError || (isSuccess && !account)) {
    return <Redirect href='/auth/sign-in' />;
  }
  return <Loading />;
};

const Index = () => {
  const { status } = useAuth();
  if (status === 'idle') {
    return <Loading />;
  } else {
    return <CustomRedirect />;
  }
};

export default Index;
