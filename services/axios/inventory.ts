import { IInventory } from '~/lib/types';

import api from '../httpRequests';

export const getInventory = async () => {
  const response = await api.get<IInventory[]>('inventories');
  return response;
};
