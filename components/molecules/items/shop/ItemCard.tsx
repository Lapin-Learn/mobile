import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { ShopItemEnum } from '~/lib/enums';

import ItemPriceCard from './ItemPriceCard';

export type ItemCardProps = {
  id: string;
  name: ShopItemEnum;
  image: string;
  price: {
    [key: string]: number;
  };
  popular?: string;
  onBuy: (price: number) => boolean;
};

export const ItemCard = (props: ItemCardProps) => {
  const { t } = useTranslation('item');
  const { name, image, price } = props;

  return (
    <View style={styles.itemContainer}>
      <Image source={{ uri: image }} width={64} style={{ objectFit: 'contain' }} />
      <View style={{ flexGrow: 1, flexShrink: 1 }}>
        <View>
          <Text style={styles.itemNameText}>{t(`shop.items.${name}.name`)}</Text>
          <Text style={styles.itemDescriptionText}>{t(`shop.items.${name}.description`)}</Text>
        </View>
        <View style={styles.itemPriceContainer}>
          {Object.entries(price).map(([key, value]) => (
            <ItemPriceCard key={key} amount={parseInt(key)} value={value} {...props} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    ...Styles.borderColor.neutral[100],
  },
  itemNameText: {
    ...Styles.fontSize['title-4'],
    ...Styles.font.semibold,
  },
  itemDescriptionText: {
    ...Styles.fontSize.footnote,
    ...Styles.color.supportingText,
    ...Styles.font.semibold,
  },
  itemPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
});
