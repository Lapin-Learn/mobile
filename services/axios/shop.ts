import { IShop } from '~/lib/types';

import api from '../httpRequests';

export const getShop = async () => {
  try {
    const response = await api.get<IShop[]>('shops');
    return response;
  } catch (error) {
    console.error('Error fetching shop:', error);
    throw error;
  }
};
