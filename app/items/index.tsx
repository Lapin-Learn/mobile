import { router } from 'expo-router';
import { LucideMoveLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import InventoryIcon from '~/assets/images/items/Inventory.svg';
import InventoryActiveIcon from '~/assets/images/items/InventoryActive.svg';
import ShopIcon from '~/assets/images/items/Shop.svg';
import ShopActiveIcon from '~/assets/images/items/ShopActive.svg';
import { Inventory } from '~/components/molecules/items/inventory/Inventory';
import { Shop } from '~/components/molecules/items/shop/Shop';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import Carrots from '~/components/molecules/track-bar/Carrots';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useGameProfile } from '~/hooks/react-query/useUser';

const ItemTabs = ({ isShop, setIsShop }: { isShop: boolean; setIsShop: (isShop: boolean) => void }) => {
  const { t } = useTranslation('item');
  return (
    <View style={styles.tabContainer}>
      <Button
        size='lg'
        variant='link'
        style={[styles.buttonContainer, isShop && { ...Styles.borderColor.orange[500] }]}
        onPress={() => setIsShop(true)}>
        {isShop ? <ShopActiveIcon /> : <ShopIcon />}
        <Text style={[styles.buttonText, isShop && { ...Styles.color.orange[500] }]}>{t('shop.title')}</Text>
      </Button>
      <Button
        size='lg'
        variant='link'
        style={[styles.buttonContainer, !isShop && { ...Styles.borderColor.orange[500] }]}
        onPress={() => setIsShop(false)}>
        {!isShop ? <InventoryActiveIcon /> : <InventoryIcon />}
        <Text style={[styles.buttonText, !isShop && { ...Styles.color.orange[500] }]}>{t('inventory.title')}</Text>
      </Button>
    </View>
  );
};

const HeaderSection = () => {
  const { data } = useGameProfile();
  return (
    <View style={{ height: 165 }}>
      <NavigationBar
        headerLeftShown
        onHeaderLeftPress={() => (
          <Pressable
            style={{ width: 24 }}
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
            carrots={data?.carrots ?? 0}
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
        )}
      />
    </View>
  );
};

const Items = () => {
  const [isShop, setIsShop] = useState(true);

  return (
    <>
      <PlatformView style={{ flex: 1, ...Styles.backgroundColor.blue[300], paddingBottom: 0 }}>
        {/* TODO: add banner */}
        <HeaderSection />
        <View style={[styles.itemView, { ...Styles.backgroundColor.background }]}>
          <ItemTabs isShop={isShop} setIsShop={setIsShop} />
          <View style={styles.itemView}>{isShop ? <Shop /> : <Inventory />}</View>
        </View>
      </PlatformView>
      <SafeAreaView style={{ flex: 0, ...Styles.backgroundColor.background }} />
    </>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  itemView: {
    flex: 1,
  },
  buttonContainer: {
    borderBottomWidth: 2,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    borderRadius: 0,
    ...Styles.borderColor.transparent,
  },
  buttonText: { ...Styles.font.semibold, ...Styles.fontSize.subhead, ...Styles.color.supportingText },
});

export default Items;
