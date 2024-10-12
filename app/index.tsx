import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Redirect } from 'expo-router';

import { Loading } from '~/components/molecules/Loading';
import { useAuth } from '~/hooks/zustand';

const Index = () => {
  const { status } = useAuth();

  if (status === 'idle') {
    return <Loading />;
  } else {
    return <Redirect href='/(tabs)' />;
  }
};

export default Index;
