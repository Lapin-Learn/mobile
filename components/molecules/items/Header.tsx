import { router } from 'expo-router';
import { LucideMoveLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { ShopInventoryMapping } from '~/hooks/zustand/useShopStore';

import { NavigationBar } from '../NavigationBar';
import Carrots from '../track-bar/Carrots';

export const HeaderSection = ({ carrots = 0 }: { carrots?: number }) => {
  const { t } = useTranslation('item');
  return (
    <View style={{ flexShrink: 1, paddingBottom: 16 }}>
      <NavigationBar
        headerLeftShown
        onHeaderLeftPress={() => (
          <Pressable
            style={{ padding: 16 }}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.dismiss();
              }
            }}>
            <LucideMoveLeft color='white' />
          </Pressable>
        )}
        headerRightShown
        onHeaderRightPress={() => (
          <Carrots
            carrots={carrots}
            size='base'
            style={{
              ...Styles.backgroundColor.blue[50],
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 100,
              shadowColor: '#005FA4',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
            }}
            textStyle={{ ...Styles.font.bold, ...Styles.fontSize.subhead }}
          />
        )}>
        <View style={{ paddingTop: 16, paddingStart: 16 }}>
          <Text style={{ ...Styles.font.bold, ...Styles.fontSize.streak, ...Styles.color.white }}>
            {t(ShopInventoryMapping.title.shop)}
          </Text>
          <Text style={{ ...Styles.font.semibold, ...Styles.fontSize.headline, ...Styles.color.white }}>
            {t('shop.greetings')}
          </Text>
        </View>
      </NavigationBar>
    </View>
  );
};
