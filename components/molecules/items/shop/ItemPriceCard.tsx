import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Carrots from '~/components/molecules/track-bar/Carrots';
import Styles from '~/constants/GlobalStyles';
import { ShopModalType, useShopStore } from '~/hooks/zustand/useShopStore';

import { ItemCardProps } from './ItemCard';

export type ItemPriceProps = {
  amount: number;
  value: number;
};

export type ItemPriceCardProps = ItemPriceProps & Pick<ItemCardProps, 'name' | 'id' | 'popular' | 'image'>;

const PopularTag = () => {
  const { t } = useTranslation('item');

  return (
    <View style={styles.popularTag}>
      <Text style={styles.popularTagText}>{t('shop.price.popular')}</Text>
    </View>
  );
};

const ItemPriceCard = (props: ItemPriceCardProps) => {
  const { amount: quantity, value, popular } = props;
  const { t } = useTranslation('item');
  const { openModal } = useShopStore();

  return (
    <Pressable style={styles.itemPriceContainer} onPress={() => openModal({ ...props, type: ShopModalType.Buy })}>
      {String(quantity) === popular && <PopularTag />}
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 4 }}>
        <Text style={{ ...Styles.fontSize.footnote }}>
          {quantity === 1 ? t('shop.price.single_pack') : t('shop.price.pack', { quantity })}
        </Text>
        <Carrots carrots={value} size='sm' />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemPriceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    gap: 4,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    ...Styles.borderColor.neutral[100],
  },
  popularTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 4,
    padding: 4,
    ...Styles.backgroundColor.orange[500],
  },
  popularTagText: {
    ...Styles.fontSize['caption-2'],
    ...Styles.color.white,
  },
});

export default ItemPriceCard;
