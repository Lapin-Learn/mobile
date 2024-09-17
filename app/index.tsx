import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Redirect } from 'expo-router';

import { Loading } from '~/components/molecules/Loading';
import { hydrate, useAuth } from '~/hooks/zustand';

hydrate();

export default function Index() {
  const { status } = useAuth();

  if (status === 'idle') {
    return <Loading />;
  } else if (status === 'signOut') {
    return <Redirect href='/auth/sign-in' />;
  } else {
    return <Redirect href='/(tabs)' />;
  }
}
