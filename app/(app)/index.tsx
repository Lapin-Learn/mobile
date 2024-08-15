import { getLocales } from 'expo-localization';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { hydrate, signOut, useAuth } from '~/hooks/zustand';
import i18n from '~/i18n';
import useGameStore from '~/stores/game';

export default function Index() {
  const { isPlay, setIsPlay } = useGameStore();
  const { t } = useTranslation();
  const { status } = useAuth();

  useEffect(() => {
    hydrate();
  }, []);

  if (status === 'idle') {
    // Display loading indicator while hydrating the auth state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={50} color='blue' />
      </View>
    );
  }

  if (status === 'signOut') {
    return <Redirect href='/auth/sign-in' />;
  }

  return (
    <View className='m-auto flex-col justify-around'>
      <Text className='text-center text-red-500 font-bold'>Hehe, setup xong r ne!</Text>
      <Button variant='outline' onPress={() => setIsPlay(!isPlay)}>
        <Text>Simple Button using RNR</Text>
        <Text>{isPlay ? 'Playing' : 'Not Playing'}</Text>
      </Button>
      <Text>
        <Text>{t('Welcome to React')}</Text>
      </Text>
      <Text>Current locale: {i18n.language}</Text>
      <Text>Device locale: {getLocales()[0].languageCode}</Text>
      <Text>{status}</Text>
      <Button onPress={signOut} variant='outline'>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
