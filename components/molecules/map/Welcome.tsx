import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';

import Cloud from '~/assets/images/map/cloud.jpg';
import Moon from '~/assets/images/map/moon.jpg';
import Sun from '~/assets/images/map/sun.jpg';
import Styles from '~/constants/GlobalStyles';
import { QUERY_KEYS } from '~/lib/constants';
import { IAccountIdentifer } from '~/lib/types';

const ICONS: Record<'sun' | 'moon' | 'cloud', any> = { sun: Sun, moon: Moon, cloud: Cloud };

const getTime = (hour: number) =>
  hour < 12
    ? { icon: ICONS.sun, greeting: 'morning' }
    : hour < 18
      ? { icon: ICONS.cloud, greeting: 'afternoon' }
      : { icon: ICONS.moon, greeting: 'evening' };

export const Welcome = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData<IAccountIdentifer>([QUERY_KEYS.profile.identifier]);
  const { icon: CurrentTimeIcon, greeting } = getTime(new Date().getHours());
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap: 8 }}>
      <View style={{ flex: 1, gap: 8 }}>
        <Text
          style={{ ...Styles.fontSize['title-2'], ...Styles.font.semibold, ...Styles.color.black }}
          numberOfLines={1}
          ellipsizeMode='tail'>
          {t(`map.greeting.${greeting}`, { username: cachedData?.username })}
        </Text>
        <Text
          style={{ ...Styles.fontSize.callout, ...Styles.font.medium, ...Styles.color.supportingText, flexShrink: 1 }}>
          {t('map.encourage')}
        </Text>
      </View>
      <View style={{ width: 64, height: 64 }}>
        <Image source={CurrentTimeIcon} style={{ ...StyleSheet.absoluteFillObject }} />
      </View>
    </View>
  );
};
