import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';

import InventoryEmpty from '~/assets/images/items/InventoryEmpty.svg';
import Styles from '~/constants/GlobalStyles';
import { useInventory } from '~/hooks/react-query/useItem';
import { ItemEnum } from '~/lib/enums';
import { IInventory } from '~/lib/types';

import { Loading } from '../../Loading';
import { Item } from './ItemCard';

const temp: IInventory = {
  id: '',
  name: ItemEnum.STREAK_FREEZE,
  description: '',
  price: {},
  duration: 0,
  imageId: '',
  image: {
    id: '',
    name: '',
    owner: '',
    permission: '',
    url: '',
  },
  quantity: 0,
  expAt: '',
};

export const Inventory = () => {
  const { t } = useTranslation('item');
  const { data, isLoading } = useInventory();

  const dataWithTemp = useMemo(() => {
    if (data && data?.length === 1 && !isLoading) {
      return [...data, temp];
    }
    return data;
  }, [data]);

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
      style={{ paddingVertical: 16, margin: 'auto' }}
      contentContainerStyle={{ justifyContent: 'center', gap: 16 }}
      columnWrapperStyle={{ justifyContent: 'flex-start', gap: 16 }}
      numColumns={2}
      data={dataWithTemp}
      renderItem={({ item }) => (
        <Item
          key={item.id}
          id={item.id}
          itemId={item.id}
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
