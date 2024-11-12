import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '~/lib/constants';
import { getInventory } from '~/services/axios/inventory';

export const useInventory = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.inventory],
    queryFn: getInventory,
    staleTime: Infinity,
  });
};
