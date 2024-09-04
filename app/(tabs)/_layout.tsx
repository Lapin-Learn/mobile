import { useCallback, useEffect } from 'react';
import { SplashScreen, Tabs } from 'expo-router';

import IconPracticeTab from '~/assets/images/tab-practice.svg';
import IconMissionTab from '~/assets/images/tab-mission.svg';
import IconMapTab from '~/assets/images/tab-map.svg';
import IconVocabularyTab from '~/assets/images/tab-vocabulary.svg';
import IconProfileTab from '~/assets/images/tab-profile.svg';
import { useAuth } from '~/hooks/zustand';

export default function TabsLayout() {
  const { status } = useAuth();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  return (
    <Tabs initialRouteName='(map)' screenOptions={{ tabBarShowLabel: false, headerShown: false, tabBarStyle: { height: 64 } }}>
      <Tabs.Screen
        name='practice'
        options={{
          tabBarIcon: IconPracticeTab,
        }}
      />
      <Tabs.Screen
        name='mission'
        options={{
          tabBarIcon: IconMissionTab,
        }}
      />
      <Tabs.Screen
        name='(map)'
        options={{
          tabBarIcon: IconMapTab,
        }}
      />
      <Tabs.Screen
        name='vocabulary'
        options={{
          tabBarIcon: IconVocabularyTab,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarIcon: IconProfileTab,
        }}
      />
    </Tabs>
  );
}
