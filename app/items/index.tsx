import { router } from 'expo-router';
import { LucideMoveLeft } from 'lucide-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import InventoryIcon from '~/assets/images/items/Inventory.svg';
import InventoryActiveIcon from '~/assets/images/items/InventoryActive.svg';
import ShopIcon from '~/assets/images/items/Shop.svg';
import ShopActiveIcon from '~/assets/images/items/ShopActive.svg';
import { Inventory } from '~/components/molecules/items/inventory/Inventory';
import { Shop } from '~/components/molecules/items/shop/Shop';
import { NavigationBar } from '~/components/molecules/NavigationBar';
import { ShopModal } from '~/components/molecules/ShopModal';
import Carrots from '~/components/molecules/track-bar/Carrots';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useGameProfile } from '~/hooks/react-query/useUser';
import { useShopStore } from '~/hooks/zustand/useShopStore';
import { GLOBAL_STYLES } from '~/lib/constants';

const ItemTabs = ({ isShop }: { isShop: boolean }) => {
  const { t } = useTranslation('item');
  const { setCurrentView } = useShopStore();
  return (
    <View style={styles.tabContainer}>
      <Button
        size='lg'
        variant='link'
        style={[styles.buttonContainer, isShop && { ...Styles.borderColor.orange[500] }]}
        onPress={() => setCurrentView('shop')}>
        {isShop ? <ShopActiveIcon /> : <ShopIcon />}
        <Text style={[styles.buttonText, isShop && { ...Styles.color.orange[500] }]}>{t('shop.title')}</Text>
      </Button>
      <Button
        size='lg'
        variant='link'
        style={[styles.buttonContainer, !isShop && { ...Styles.borderColor.orange[500] }]}
        onPress={() => setCurrentView('inventory')}>
        {!isShop ? <InventoryActiveIcon /> : <InventoryIcon />}
        <Text style={[styles.buttonText, !isShop && { ...Styles.color.orange[500] }]}>{t('inventory.title')}</Text>
      </Button>
    </View>
  );
};

const HeaderSection = ({ carrots = 0 }: { carrots?: number }) => {
  const { t } = useTranslation('item');
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
        <View style={{ paddingTop: 16 }}>
          <Text style={{ ...Styles.font.bold, ...Styles.fontSize.streak, ...Styles.color.white }}>Shop</Text>
          <Text style={{ ...Styles.font.semibold, ...Styles.fontSize.headline, ...Styles.color.white }}>
            {t('shop.greetings')}
          </Text>
        </View>
      </NavigationBar>
    </View>
  );
};

const Items = () => {
  const { data } = useGameProfile();
  const { isModalVisible, currentView, setCarrot } = useShopStore();

  useEffect(() => {
    setCarrot(data?.carrots || 0);
  }, [data?.carrots]);

  return (
    <>
      <PlatformView style={{ flex: 1, ...Styles.backgroundColor.blue[300], paddingBottom: 0 }}>
        {/* TODO: add banner */}
        <HeaderSection carrots={data?.carrots} />
        <View style={[styles.itemView, { ...Styles.backgroundColor.background }]}>
          <ItemTabs isShop={currentView === 'shop'} />
          <View style={styles.itemView}>{currentView === 'shop' ? <Shop /> : <Inventory />}</View>
        </View>
      </PlatformView>
      <SafeAreaView style={{ flex: 0, ...Styles.backgroundColor.background }} />
      {isModalVisible && <View style={GLOBAL_STYLES.modalBackground} />}
      <ShopModal />
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
