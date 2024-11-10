import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import InventoryEmpty from '~/assets/images/items/InventoryEmpty.svg';
import Styles from '~/constants/GlobalStyles';
import { ShopItemEnum } from '~/lib/enums';

import { Item, ItemCardProps } from './ItemCard';
const data: ItemCardProps[] = [
  {
    id: '7f151944-2085-469d-b7b0-e8664b79848e',
    name: 'STREAK_FREEZE' as ShopItemEnum,
    description: 'Streak Freeze',
    amount: 1,
    imageId: 'b51ae487-d2a8-4592-986f-fc444c84b9e9',
    image: {
      url: 'https://vou.453294f7d0377a0acaec90d3a0ff135c.r2.cloudflarestorage.com/b51ae487-d2a8-4592-986f-fc444c84b9e9?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=61bb1234d6eabb97b2c3fddc8f0f5fb5%2F20241109%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241109T082747Z&X-Amz-Expires=3600&X-Amz-Signature=acd1db273999f20f1b001aa0da4b106aad16821f0fba32f6cbde0f0fa11a96ae&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3Dstreak_freeze.png&x-id=GetObject',
    },
  },
  {
    id: '0a1fbe80-0f8e-47f9-9f70-d718b76147bf',
    name: 'RANDOM_GIFT' as ShopItemEnum,
    description: 'Quà tặng ngẫu nhiên',
    amount: 5,
    imageId: '710b936c-ee1e-419c-9385-007d6bd36faf',
    image: {
      url: 'https://vou.453294f7d0377a0acaec90d3a0ff135c.r2.cloudflarestorage.com/710b936c-ee1e-419c-9385-007d6bd36faf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=61bb1234d6eabb97b2c3fddc8f0f5fb5%2F20241109%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241109T082747Z&X-Amz-Expires=3600&X-Amz-Signature=e33dc9416405cc3db57f52859eb364532df995ea4cb48a20ae9f06791204e71d&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3Drandom_gift.png&x-id=GetObject',
    },
  },
  {
    id: 'b59174e5-5d0b-48d6-895c-b0bbeafe577b',
    name: 'ULTIMATE_TIME' as ShopItemEnum,
    description: 'Thời gian siêu cấp',
    amount: 3,
    imageId: 'f074c116-d74a-440b-8d18-796e9e115822',
    image: {
      url: 'https://vou.453294f7d0377a0acaec90d3a0ff135c.r2.cloudflarestorage.com/f074c116-d74a-440b-8d18-796e9e115822?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=61bb1234d6eabb97b2c3fddc8f0f5fb5%2F20241109%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241109T082747Z&X-Amz-Expires=3600&X-Amz-Signature=0b370dff29868afa60f48f5c23e198f00259776ffded42b59c36d9de52cce6ae&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3Dultimate_time.png&x-id=GetObject',
    },
  },

  {
    id: 'ca8499e3-c7c1-43fe-855e-b6ba45a2fa66',
    name: 'IDENTIFICATION' as ShopItemEnum,
    description: 'Nhận diện',
    amount: 4,
    imageId: '458f1b59-5304-48d4-89e5-c4b5e1782dac',
    image: {
      url: 'https://vou.453294f7d0377a0acaec90d3a0ff135c.r2.cloudflarestorage.com/b51ae487-d2a8-4592-986f-fc444c84b9e9?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=61bb1234d6eabb97b2c3fddc8f0f5fb5%2F20241110%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241110T093655Z&X-Amz-Expires=3600&X-Amz-Signature=1dca5ff1d23b897b402f4787477c4dd6f0f5aed353aa6ad8bcd854af3a86cb33&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3Dstreak_freeze.png&x-id=GetObject',
    },
  },
  {
    id: 'ca8499e3-c7c1-43fe-855e-b6ba45a2fa65',
    name: 'IDENTIFICATION' as ShopItemEnum,
    description: 'Nhận diện',
    amount: 4,
    imageId: '458f1b59-5304-48d4-89e5-c4b5e1782dac',
    image: {
      url: 'https://vou.453294f7d0377a0acaec90d3a0ff135c.r2.cloudflarestorage.com/b51ae487-d2a8-4592-986f-fc444c84b9e9?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=61bb1234d6eabb97b2c3fddc8f0f5fb5%2F20241110%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20241110T093655Z&X-Amz-Expires=3600&X-Amz-Signature=1dca5ff1d23b897b402f4787477c4dd6f0f5aed353aa6ad8bcd854af3a86cb33&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3Dstreak_freeze.png&x-id=GetObject',
    },
  },
];
export const Inventory = () => {
  const { t } = useTranslation('item');
  // const { data, isLoading } = useInventory();
  // const data = [];

  // if (isLoading) return <Loading />;

  if (data.length === 0)
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <InventoryEmpty />
        <Text style={{ ...Styles.fontSize.subhead, ...Styles.font.semibold, textAlign: 'center' }}>
          {t('inventory.empty')}
        </Text>
      </View>
    );

  return (
    <ScrollView>
      <View style={styles.container}>
        {Object.values(data).map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    columnGap: 16,
    rowGap: 16,
    marginVertical: 16,
  },
});
