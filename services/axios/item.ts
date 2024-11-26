import { ItemEnum } from '~/lib/enums';
import { IInventory, IItem, IReward, IShop } from '~/lib/types';

import { default as api } from '../httpRequests';

export type BuyItemParams = {
  id: string;
  quantity: number;
};

export const getShop = async () => {
  const response = await api.get<IShop[]>('shops');
  return response;
};

export const buyItem = async (params: BuyItemParams) => {
  const response = await api.post<IItem>('shops/buy', { body: params });
  return response;
};

export const getInventory = async () => {
  const response = await api.get<IInventory[]>('inventories');
  return response;
};

export const useItem = async (itemId: string) => {
  const response = await api.put<IReward | { type: ItemEnum }>('inventories/use-item', {
    body: {
      itemId,
    },
  });
  return response;
};
