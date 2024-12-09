import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';

import InventoryEmpty from '~/assets/images/items/InventoryEmpty.svg';
import Styles from '~/constants/GlobalStyles';
import { useInventory } from '~/hooks/react-query/useItem';

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
          {t('inventory.empty')}
        </Text>
      </View>
    );

  return (
    <FlatList
      style={{ padding: 16 }}
      contentContainerStyle={{ justifyContent: 'center', gap: 16 }}
      columnWrapperStyle={{ justifyContent: (data?.length || 0) % 2 === 1 ? 'flex-start' : 'center', gap: 16 }}
      numColumns={2}
      data={data}
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
      ListFooterComponent={() => <View style={{ height: 20 }} />}
    />
  );
};
