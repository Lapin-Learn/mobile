import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '~/lib/constants';
import { getShop } from '~/services/axios/shop';

export const useShop = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.shop],
    queryFn: getShop,
    staleTime: Infinity,
  });
};
