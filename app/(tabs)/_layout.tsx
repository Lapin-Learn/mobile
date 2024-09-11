import { SplashScreen, Tabs } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import IconMapTab from '~/assets/images/tab-map.svg';
import IconMissionTab from '~/assets/images/tab-mission.svg';
import IconPracticeTab from '~/assets/images/tab-practice.svg';
import IconProfileTab from '~/assets/images/tab-profile.svg';
import IconVocabularyTab from '~/assets/images/tab-vocabulary.svg';
import { useAuth } from '~/hooks/zustand';

function ActiveTabIcon({ icon: Icon, focused }: { icon: React.FC<SvgProps>; focused: boolean }) {
  return (
    <View className={`${focused ? 'm-4 rounded border border-orange-500 bg-orange-50' : ''}`}>
      <Icon />
    </View>
  );
}

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
    <Tabs
      initialRouteName='(map)'
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: { height: Platform.OS === 'ios' ? 101 : 80 },
        tabBarIcon: ({ focused }) => {
          const iconMapping: { [key: string]: React.FC<SvgProps> } = {
            practice: IconPracticeTab,
            mission: IconMissionTab,
            '(map)': IconMapTab,
            vocabulary: IconVocabularyTab,
            profile: IconProfileTab,
          };

          return <ActiveTabIcon icon={iconMapping[route.name]} focused={focused} />;
        },
      })}>
      <Tabs.Screen name='practice' />
      <Tabs.Screen name='mission' />
      <Tabs.Screen name='(map)' />
      <Tabs.Screen name='vocabulary' />
      <Tabs.Screen name='profile' />
    </Tabs>
  );
}
