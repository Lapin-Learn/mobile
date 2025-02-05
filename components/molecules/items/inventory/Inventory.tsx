import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';

import InventoryEmpty from '~/assets/images/items/InventoryEmpty.svg';
import Styles from '~/constants/GlobalStyles';
import { useInventory } from '~/hooks/react-query/useItem';
import { ShopInventoryMapping } from '~/hooks/zustand/useShopStore';
import { ItemEnum } from '~/lib/enums';

import { Loading } from '../../Loading';
import { Item } from './ItemCard';

export const Inventory = () => {
  const { t } = useTranslation('item');
  const { data, isLoading } = useInventory();

  if (isLoading) return <Loading />;

  if (data?.length === 0)
    return (
      <View style={{ alignItems: 'center', gap: 24, paddingHorizontal: 48, paddingTop: 60 }}>
        <InventoryEmpty />
        <Text style={{ ...Styles.fontSize.subhead, ...Styles.font.semibold, textAlign: 'center' }}>
          {t(ShopInventoryMapping.empty.inventory)}
        </Text>
      </View>
    );

  return (
    <FlatList
      style={{ width: '100%', padding: 16 }}
      contentContainerStyle={{ justifyContent: 'center', gap: 12 }}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      numColumns={2}
      data={data?.filter((item) => item.name !== ItemEnum.IDENTIFICATION)}
      renderItem={({ item }) => (
        <Item
          key={item.id}
          id={item.id}
          name={item.name}
          description={item.description}
          imageId={item.imageId}
          image={item.image.url}
          amount={item.quantity}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
