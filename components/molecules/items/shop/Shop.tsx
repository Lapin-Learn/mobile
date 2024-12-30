import { FlatList, View } from 'react-native';

import { useShop } from '~/hooks/react-query/useItem';
import { ItemEnum } from '~/lib/enums';

import { Loading } from '../../Loading';
import { ItemCard } from '../shop/ItemCard';

export const Shop = () => {
  const { data, isLoading } = useShop();
  if (isLoading) return <Loading />;

  return (
    <FlatList
      style={{ padding: 16, width: '100%', flex: 1 }}
      data={data?.filter((item) => item.name !== ItemEnum.IDENTIFICATION)}
      renderItem={({ item }) => (
        <ItemCard
          key={item.id}
          id={item.id}
          name={item.name}
          image={item.image.url}
          price={item.price}
          popular={item.popular}
        />
      )}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      ListFooterComponent={() => <View style={{ height: 20 }} />}
    />
  );
};
