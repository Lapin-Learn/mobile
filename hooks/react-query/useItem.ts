import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '~/lib/constants';
import { buyItem, getInventory, getShop } from '~/services/axios/item';

export const useShop = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.shop],
    queryFn: getShop,
    staleTime: Infinity,
  });
};

export const useBuyShopItem = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: buyItem,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEYS.inventory] });
      client.invalidateQueries({ queryKey: [QUERY_KEYS.profile.game] });
    },
  });
};

export const useInventory = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.inventory],
    queryFn: getInventory,
    staleTime: Infinity,
  });
};
