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
};

const ItemCard = (props: ItemCardProps) => {
  const { t } = useTranslation('shop');
  const { name, image, price } = props;

  return (
    <View style={styles.itemContainer}>
      <Image source={{ uri: image }} width={64} style={{ objectFit: 'contain' }} />
      <View>
        <Text style={styles.itemNameText}>{t(`items.${name}.name`)}</Text>
        <Text style={styles.itemDescriptionText}>{t(`items.${name}.description`)}</Text>
        <View style={styles.itemPriceContainer}>
          {Object.entries(price).map(([key, value]) => (
            <ItemPriceCard key={key} quantity={key} value={value} {...props} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderWidth: 1,
    ...Styles.borderColor.neutral[100],
    borderRadius: 8,
  },
  itemNameText: {
    ...Styles.fontSize['title-4'],
    ...Styles.font.semibold,
  },
  itemDescriptionText: {
    ...Styles.fontSize['footnote'],
    ...Styles.color.supportingText,
    ...Styles.font.semibold,
  },
  itemPriceContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});

export default ItemCard;
