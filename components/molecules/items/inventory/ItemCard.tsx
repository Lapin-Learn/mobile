import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { default as Styles } from '~/constants/GlobalStyles';
import { ShopModalType, useShopStore } from '~/hooks/zustand/useShopStore';
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
          type: ShopModalType.Use,
        })
      }>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: props.image }}
          style={styles.image}
          shouldRasterizeIOS
          contentFit='contain'
          contentPosition='center'
          transition={500}
          priority='high'
        />
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
  imageContainer: {
    paddingVertical: 17.25,
  },
  image: {
    width: 80,
    height: 80,
  },
  itemView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    width: '48.5%',
  },
});
