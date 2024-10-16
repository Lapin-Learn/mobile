import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '~/lib/constants';
import { getMissions } from '~/services/axios/mission';

export const useMissions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.missions],
    queryFn: getMissions,
    staleTime: Infinity,
  });
};
