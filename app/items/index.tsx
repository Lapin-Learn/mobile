import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import InventoryIcon from '~/assets/images/items/Inventory.svg';
import InventoryActiveIcon from '~/assets/images/items/InventoryActive.svg';
import ShopIcon from '~/assets/images/items/Shop.svg';
import ShopActiveIcon from '~/assets/images/items/ShopActive.svg';
import { HeaderSection } from '~/components/molecules/items/Header';
import { Inventory } from '~/components/molecules/items/inventory/Inventory';
import { Shop } from '~/components/molecules/items/shop/Shop';
import { ShopModal } from '~/components/organisms/modals/ShopModal';
import PlatformView from '~/components/templates/PlatformView';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { useGameProfile } from '~/hooks/react-query/useUser';
import { ShopInventory, ShopInventoryMapping, useShopStore } from '~/hooks/zustand/useShopStore';
import { GLOBAL_STYLES } from '~/lib/constants';

const ItemTabs = ({ isShop }: { isShop: boolean }) => {
  const { t } = useTranslation('item');
  const { setCurrentView } = useShopStore();
  const ShopInventoryTabs = [
    {
      isActive: isShop,
      icon: ShopIcon,
      activeIcon: ShopActiveIcon,
      view: ShopInventoryMapping.view.shop,
      title: ShopInventoryMapping.title.shop,
    },
    {
      isActive: !isShop,
      icon: InventoryIcon,
      activeIcon: InventoryActiveIcon,
      view: ShopInventoryMapping.view.inventory,
      title: ShopInventoryMapping.title.inventory,
    },
  ];

  return (
    <View style={styles.tabContainer}>
      {ShopInventoryTabs.map(({ isActive, icon: Icon, activeIcon: ActiveIcon, view, title }, index) => (
        <Button
          key={index}
          size='lg'
          variant='link'
          style={[styles.buttonContainer, isActive && { ...Styles.borderColor.orange[500] }]}
          onPress={() => setCurrentView(view)}>
          {isActive ? <ActiveIcon /> : <Icon />}
          <Text style={[styles.buttonText, isActive && { ...Styles.color.orange[500] }]}>{t(title)}</Text>
        </Button>
      ))}
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
          <ItemTabs isShop={currentView === ShopInventory.Shop} />
          {currentView === ShopInventory.Shop ? <Shop /> : <Inventory />}
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
