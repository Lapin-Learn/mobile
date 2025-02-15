import { ParamListBase, RouteProp } from '@react-navigation/native';
import { SplashScreen, Tabs } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import IconMapTab from '~/assets/images/tab-lessons.svg';
import IconMissionTab from '~/assets/images/tab-mission.svg';
import IconProfileTab from '~/assets/images/tab-profile.svg';
import Styles from '~/constants/GlobalStyles';
import { useAuth } from '~/hooks/zustand';

type ActiveTabIconProps = { name: string; icon: React.FC<SvgProps>; focused: boolean };

const ActiveTabIcon = ({ name, icon: Icon, focused }: ActiveTabIconProps) => {
  const { t } = useTranslation();
  return (
    <View style={[styles.container, focused ? styles.active : {}]}>
      <Icon fill={focused ? Styles.color.orange[500].color : Styles.color.neutral[200].color} />
      <Text style={styles.text}>{t(`tabs.${name}`)}</Text>
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
      backBehavior='history'
      screenOptions={({ route }: { route: RouteProp<ParamListBase, string> }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: [
          {
            height: Platform.OS === 'ios' ? 101 : 80,
          },
        ],
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          const iconMapping: { [key: string]: React.FC<SvgProps> } = {
            mission: IconMissionTab,
            '(map)': IconMapTab,
            profile: IconProfileTab,
          };

          const IconComponent = iconMapping[route.name];

          return (
            IconComponent && (
              <ActiveTabIcon
                name={route.name === '(map)' ? 'lessons' : route.name}
                icon={IconComponent}
                focused={focused}
              />
            )
          );
        },
      })}>
      <Tabs.Screen name='(map)' />
      <Tabs.Screen name='mission' />
      <Tabs.Screen name='profile' />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 8,
    borderTopWidth: 2,
    borderTopColor: Styles.color.transparent.color,
  },
  active: {
    borderTopColor: Styles.color.orange[500].color,
  },
  text: {
    ...Styles.font.semibold,
    ...Styles.fontSize['caption-1'],
    ...Styles.color.dark,
  },
});

export default TabsLayout;
