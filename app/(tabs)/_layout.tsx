import { ParamListBase, RouteProp } from '@react-navigation/native';
import { SplashScreen, Tabs } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import IconMapTab from '~/assets/images/tab-map.svg';
import IconMissionTab from '~/assets/images/tab-mission.svg';
import IconPracticeTab from '~/assets/images/tab-practice.svg';
import IconProfileTab from '~/assets/images/tab-profile.svg';
import IconVocabularyTab from '~/assets/images/tab-vocabulary.svg';
import { useAccountIdentifier } from '~/hooks/react-query/useUser';
import { useAuth } from '~/hooks/zustand';

type ActiveTabIconProps = { icon: React.FC<SvgProps>; focused: boolean };

const ActiveTabIcon = ({ icon: Icon, focused }: ActiveTabIconProps) => {
  return (
    <View className={`${focused ? 'm-4 rounded border border-orange-500 bg-orange-50' : ''}`}>
      <Icon />
    </View>
  );
};

const TabsLayout = () => {
  const { status } = useAuth();
  const { isLoading } = useAccountIdentifier();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle' && !isLoading) {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status, isLoading]);

  return (
    <Tabs
      initialRouteName='(map)'
      screenOptions={({ route }: { route: RouteProp<ParamListBase, string> }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: { height: Platform.OS === 'ios' ? 101 : 80 },
        tabBarIcon: ({ focused }: { focused: boolean }) => {
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
};

export default TabsLayout;
