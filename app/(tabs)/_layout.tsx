import { ParamListBase, RouteProp } from '@react-navigation/native';
import { SplashScreen, Tabs } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import IconMapTab from '~/assets/images/tab-map.svg';
import IconMissionTab from '~/assets/images/tab-mission.svg';
import IconPracticeTab from '~/assets/images/tab-practice.svg';
import IconProfileTab from '~/assets/images/tab-profile.svg';
import IconVocabularyTab from '~/assets/images/tab-vocabulary.svg';
import Styles from '~/constants/GlobalStyles';
import { useAuth } from '~/hooks/zustand';

type ActiveTabIconProps = { icon: React.FC<SvgProps>; focused: boolean };

const ActiveTabIcon = ({ icon: Icon, focused }: ActiveTabIconProps) => {
  return (
    <View style={focused ? styles.active : {}}>
      <Icon />
    </View>
  );
};

const TabsLayout = () => {
  const { status } = useAuth();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 500);
    }
  }, [hideSplash, status]);

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

          const IconComponent = iconMapping[route.name];

          return IconComponent && <ActiveTabIcon icon={IconComponent} focused={focused} />;
        },
      })}>
      <Tabs.Screen name='practice' options={{ tabBarButton: () => null }} />
      <Tabs.Screen name='mission' />
      <Tabs.Screen name='(map)' />
      <Tabs.Screen name='vocabulary' options={{ tabBarButton: () => null }} />
      <Tabs.Screen name='profile' />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  active: {
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Styles.color.orange[500].color,
    backgroundColor: Styles.color.orange[50].color,
  },
});

export default TabsLayout;
