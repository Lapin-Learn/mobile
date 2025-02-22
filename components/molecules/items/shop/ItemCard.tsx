import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
import { ItemEnum } from '~/lib/enums';

import ItemPriceCard from './ItemPriceCard';

export type ItemCardProps = {
  id: string;
  name: ItemEnum;
  image: string;
  price: {
    [key: string]: number;
  };
  popular?: string;
};

export const ItemCard = (props: ItemCardProps) => {
  const { t } = useTranslation('item');
  const { name, image, price } = props;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          contentFit='contain'
          contentPosition='center'
          transition={500}
          priority='high'
        />
      </View>
      <View style={{ flexGrow: 1, flexShrink: 1 }}>
        <View>
          <Text style={styles.itemNameText}>{t(`shop.items.${name}.name`)}</Text>
          <Text style={styles.itemDescriptionText}>{t(`shop.items.${name}.description`)}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.itemPriceContainer}>
            {Object.entries(price).map(([key, value]) => (
              <ItemPriceCard key={key} amount={parseInt(key)} value={value} {...props} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 64,
    height: '100%',
  },
  image: {
    width: '100%',
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
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
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
});
