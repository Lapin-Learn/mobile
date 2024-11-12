import { IItem, IShop } from '~/lib/types';

import api from '../httpRequests';

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
