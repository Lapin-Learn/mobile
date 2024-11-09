import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import { ShopModal } from '../ShopModal';
import Carrots from '../track-bar/Carrots';
import { ItemCardProps } from './ItemCard';

export type ItemPriceProps = {
  quantity: string;
  value: number;
};

export type ItemPriceCardProps = ItemPriceProps & Pick<ItemCardProps, 'name' | 'id' | 'popular' | 'image'>;

const PopularTag = () => {
  const { t } = useTranslation('shop');

  return (
    <View style={styles.popularTag}>
      <Text style={styles.popularTagText}>{t('price.popular')}</Text>
    </View>
  );
};

const ItemPriceCard = ({ id, name, quantity, value, image, popular }: ItemPriceCardProps) => {
  const [isBuying, setIsBuying] = useState(false);
  const { t } = useTranslation('shop');

  const handleBuyItem = () => {
    alert(`${id} - ${name}: ${quantity} - ${value} carrots`);
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
          {quantity === '1' ? t('price.single_pack') : t('price.pack', { quantity })}
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
