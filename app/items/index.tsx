import { FlatList, View } from 'react-native';

import { NavigationBar } from '~/components/molecules/NavigationBar';
import ItemCard from '~/components/molecules/shop/ItemCard';
import Carrots from '~/components/molecules/track-bar/Carrots';
import PlatformView from '~/components/templates/PlatformView';
import { ShopItemEnum } from '~/lib/enums';
import { IShop } from '~/lib/types';

const items: IShop[] = [
  {
    id: '7f151944-2085-469d-b7b0-e8664b79848e',
    name: 'STREAK_FREEZE' as ShopItemEnum,
    description: 'Streak Freeze',
    price: {
      '1': 200,
    },
    duration: 0,
    imageId: 'b51ae487-d2a8-4592-986f-fc444c84b9e9',
    createdAt: '2024-11-09T03:07:41.584Z',
    updatedAt: '2024-11-09T03:07:41.584Z',
    image: {
      id: 'b51ae487-d2a8-4592-986f-fc444c84b9e9',
      name: 'streak_freeze.png',
      owner: '59af9cf4-2817-40dd-9b13-52e65bf40ab0',
      permission: 'public',
      url: 'https://vou.453294f7d0377a0acaec90d3a0ff135c.r2.cloudflarestorage.com/b51ae487-d2a8-4592-986f-fc444c84b9e9?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=61bb1234d6eabb97b2c3fddc8f0f5fb5%2F20241109%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241109T082747Z&X-Amz-Expires=3600&X-Amz-Signature=acd1db273999f20f1b001aa0da4b106aad16821f0fba32f6cbde0f0fa11a96ae&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3Dstreak_freeze.png&x-id=GetObject',
    },
    popular: '1',
    isPopular: false,
  },
  {
    id: '0a1fbe80-0f8e-47f9-9f70-d718b76147bf',
    name: 'RANDOM_GIFT' as ShopItemEnum,
    description: 'Quà tặng ngẫu nhiên',
    price: {
      '1': 150,
    },
    duration: 0,
    imageId: '710b936c-ee1e-419c-9385-007d6bd36faf',
    createdAt: '2024-11-09T03:07:41.584Z',
    updatedAt: '2024-11-09T03:07:41.584Z',
    image: {
      id: '710b936c-ee1e-419c-9385-007d6bd36faf',
      name: 'random_gift.png',
      owner: '59af9cf4-2817-40dd-9b13-52e65bf40ab0',
      permission: 'public',
      url: 'https://vou.453294f7d0377a0acaec90d3a0ff135c.r2.cloudflarestorage.com/710b936c-ee1e-419c-9385-007d6bd36faf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=61bb1234d6eabb97b2c3fddc8f0f5fb5%2F20241109%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241109T082747Z&X-Amz-Expires=3600&X-Amz-Signature=e33dc9416405cc3db57f52859eb364532df995ea4cb48a20ae9f06791204e71d&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3Drandom_gift.png&x-id=GetObject',
    },
    popular: '1',
    isPopular: false,
  },
  {
    id: 'b59174e5-5d0b-48d6-895c-b0bbeafe577b',
    name: 'ULTIMATE_TIME' as ShopItemEnum,
    description: 'Thời gian siêu cấp',
    price: {
      '1': 100,
      '5': 400,
      '15': 1000,
    },
    duration: 15,
    imageId: 'f074c116-d74a-440b-8d18-796e9e115822',
    createdAt: '2024-11-09T03:07:41.584Z',
    updatedAt: '2024-11-09T03:07:41.584Z',
    image: {
      id: 'f074c116-d74a-440b-8d18-796e9e115822',
      name: 'ultimate_time.png',
      owner: '59af9cf4-2817-40dd-9b13-52e65bf40ab0',
      permission: 'public',
      url: 'https://vou.453294f7d0377a0acaec90d3a0ff135c.r2.cloudflarestorage.com/f074c116-d74a-440b-8d18-796e9e115822?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=61bb1234d6eabb97b2c3fddc8f0f5fb5%2F20241109%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241109T082747Z&X-Amz-Expires=3600&X-Amz-Signature=0b370dff29868afa60f48f5c23e198f00259776ffded42b59c36d9de52cce6ae&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3Dultimate_time.png&x-id=GetObject',
    },
    popular: '1',
    isPopular: false,
  },
  {
    id: 'ca8499e3-c7c1-43fe-855e-b6ba45a2fa6d',
    name: 'IDENTIFICATION' as ShopItemEnum,
    description: 'Nhận diện',
    price: {
      '1': 20,
      '5': 80,
      '15': 200,
    },
    duration: 0,
    imageId: '458f1b59-5304-48d4-89e5-c4b5e1782dac',
    createdAt: '2024-11-09T03:07:41.584Z',
    updatedAt: '2024-11-09T03:07:41.584Z',
    image: {
      id: '458f1b59-5304-48d4-89e5-c4b5e1782dac',
      name: 'identification.png',
      owner: '59af9cf4-2817-40dd-9b13-52e65bf40ab0',
      permission: 'public',
      url: 'https://vou.453294f7d0377a0acaec90d3a0ff135c.r2.cloudflarestorage.com/458f1b59-5304-48d4-89e5-c4b5e1782dac?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=61bb1234d6eabb97b2c3fddc8f0f5fb5%2F20241109%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241109T082747Z&X-Amz-Expires=3600&X-Amz-Signature=dfff75e7405a6c4385b034bc55054b27a34eeda1a5ecbbd23741836ff99a26ba&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3Didentification.png&x-id=GetObject',
    },
    popular: '2',
    isPopular: true,
  },
];

const Items = () => {
  return (
    <PlatformView>
      <NavigationBar headerLeftShown headerRightShown onHeaderRightPress={() => <Carrots carrots={100} />} />
      <FlatList
        style={{ padding: 16 }}
        data={items}
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
    </PlatformView>
  );
};

export default Items;
