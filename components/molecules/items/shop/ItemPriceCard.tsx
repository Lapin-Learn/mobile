import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ShopModal } from '~/components/molecules/ShopModal';
import Carrots from '~/components/molecules/track-bar/Carrots';
import Styles from '~/constants/GlobalStyles';
import { useBuyShopItem } from '~/hooks/react-query/useItem';
import { useToast } from '~/hooks/useToast';

import { ItemCardProps } from './ItemCard';

export type ItemPriceProps = {
  quantity: string;
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

const ItemPriceCard = ({ id, name, quantity, value, image, popular }: ItemPriceCardProps) => {
  const [isBuying, setIsBuying] = useState(false);
  const { t } = useTranslation('item');
  const toast = useToast();

  const buyItem = useBuyShopItem();

  const handleBuyItem = () => {
    buyItem.mutate(
      { id, quantity: parseInt(quantity) },
      {
        onSuccess: () =>
          toast.show({
            type: 'success',
            text1: t('shop.buy_success', { quantity, name }),
            text1Style: { ...Styles.color.green[500] },
          }),
      }
    );
    setIsBuying(false);
  };

  return (
    <Pressable
      style={styles.itemPriceContainer}
      onPress={() => {
        setIsBuying(true);
      }}>
      {quantity === popular && <PopularTag />}
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 4 }}>
        <Text style={{ ...Styles.fontSize.footnote }}>
          {quantity === '1' ? t('shop.price.single_pack') : t('shop.price.pack', { quantity })}
        </Text>
        <Carrots carrots={value} size='sm' />
      </View>
      {isBuying && (
        <ShopModal
          name={name}
          quantity={quantity}
          image={image}
          onContinue={handleBuyItem}
          onClose={() => setIsBuying(false)}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemPriceContainer: {
    display: 'flex',
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
