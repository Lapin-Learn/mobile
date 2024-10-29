import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Redirect } from 'expo-router';

import { Loading } from '~/components/molecules/Loading';
import { useAccountIdentifier } from '~/hooks/react-query/useUser';
import { useAuth } from '~/hooks/zustand';

const CustomRedirect = () => {
  const { isSuccess, data: account, isError } = useAccountIdentifier();
  if (isSuccess && account) {
    return <Redirect href='/(tabs)/(map)' />;
  } else if (isError || (isSuccess && !account)) {
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
