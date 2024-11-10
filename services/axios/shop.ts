import { IShop } from '~/lib/types';

import api from '../httpRequests';

export const getShop = async () => {
  const response = await api.get<IShop[]>('shops');
  return response;
};
