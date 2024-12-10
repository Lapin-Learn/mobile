import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { default as Styles } from '~/constants/GlobalStyles';
import { useShopStore } from '~/hooks/zustand/useShopStore';
import { ItemEnum } from '~/lib/enums';

export type ItemCardProps = {
  id: string;
  name: ItemEnum;
  description: string;
  imageId: string;
  image: string;
  amount: number;
};

export const Item = (props: ItemCardProps) => {
  const { t } = useTranslation('item');
  const { openModal } = useShopStore();

  return (
    <Pressable
      style={[
        styles.itemView,
        {
          borderRadius: 8,
          borderWidth: 1,
          ...Styles.borderColor.neutral[100],
          ...Styles.backgroundColor.white,
        },
      ]}
      onPress={() =>
        openModal({
          ...props,
          type: 'use',
        })
      }>
      <View style={{ paddingVertical: 17.25 }}>
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
  );
};

const styles = StyleSheet.create({
  itemView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    width: '48.5%',
  },
});
