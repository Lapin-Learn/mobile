import { FlatList, View } from 'react-native';

import { useShop } from '~/hooks/react-query/useItem';

import { Loading } from '../../Loading';
import { ItemCard } from '../shop/ItemCard';

export const Shop = ({ carrots = 0 }: { carrots?: number }) => {
  const { data, isLoading } = useShop();
  if (isLoading) return <Loading />;
  const canBuy = (price: number) => carrots >= price;

  return (
    <FlatList
      style={{ padding: 16, width: '100%', flex: 1 }}
      data={data}
      renderItem={({ item }) => (
        <ItemCard
          key={item.id}
          id={item.id}
          name={item.name}
          image={item.image.url}
          price={item.price}
          onBuy={canBuy}
        />
      )}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      ListFooterComponent={() => <View style={{ height: 20 }} />}
    />
  );
};
