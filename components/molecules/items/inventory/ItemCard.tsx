import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { default as Styles } from '~/constants/GlobalStyles';
import { ShopItemEnum } from '~/lib/enums';

export type ItemCardProps = {
  id: string;
  name: ShopItemEnum;
  description: string;
  imageId: string;
  image: string;
  amount: number;
};

export const Item = (props: ItemCardProps) => {
  const { t } = useTranslation('item');

  const handleUseItem = () => {};

  return (
    <View
      style={[
        styles.itemView,
        props.id !== 'empty' && { borderRadius: 8, borderWidth: 1, ...Styles.borderColor.neutral[100] },
      ]}>
      {props.id !== 'empty' && (
        <Pressable onPress={handleUseItem}>
          <View style={{ paddingVertical: 17.25, alignItems: 'center' }}>
            <Image source={{ uri: props.image }} style={{ width: 80, height: 80, objectFit: 'contain' }} />
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Text style={{ ...Styles.fontSize.subhead, ...Styles.font.semibold, textAlign: 'center' }}>
              {t(`shop.items.${props.name}.name`)}
            </Text>
            <Text style={{ ...Styles.fontSize['caption-1'], ...Styles.font.normal }}>
              {t('inventory.Amount', { amount: props.amount })}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 16,
    rowGap: 16,
    marginVertical: 16,
  },
  itemView: {
    flexBasis: '45%',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
});
