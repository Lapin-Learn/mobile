import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';

import Cloud from '~/assets/images/map/cloud.jpg';
import Moon from '~/assets/images/map/moon.jpg';
import Sun from '~/assets/images/map/sun.jpg';
import Styles from '~/constants/GlobalStyles';
import { useAccountIdentifier } from '~/hooks/react-query/useUser';

const ICONS: Record<'sun' | 'moon' | 'cloud', any> = { sun: Sun, moon: Moon, cloud: Cloud };

const getTime = (hour: number) =>
  hour < 12
    ? { icon: ICONS.sun, greeting: 'morning' }
    : hour < 18
      ? { icon: ICONS.cloud, greeting: 'afternoon' }
      : { icon: ICONS.moon, greeting: 'evening' };

export const Welcome = () => {
  const { t } = useTranslation();
  const { data: cachedData } = useAccountIdentifier();
  const { icon: CurrentTimeIcon, greeting } = getTime(new Date().getHours());
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap: 8 }}>
      <View style={{ flex: 1, gap: 8 }}>
        <Text style={{ ...Styles.fontSize.body, ...Styles.font.semibold }} numberOfLines={1} ellipsizeMode='tail'>
          {t(`map.greeting.${greeting}`, { username: cachedData?.username })}
        </Text>
        <Text
          style={{ ...Styles.fontSize.subhead, ...Styles.font.medium, ...Styles.color.supportingText, flexShrink: 1 }}>
          {t('map.encourage')}
        </Text>
      </View>
      <View style={{ width: 60, height: 60 }}>
        <Image source={CurrentTimeIcon} style={{ ...StyleSheet.absoluteFillObject }} />
      </View>
    </View>
  );
};
