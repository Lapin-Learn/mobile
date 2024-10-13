import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '~/lib/constants';
import { getStreak } from '~/services/axios/streak';

export const useStreaks = ({ startDate }: { startDate: string | null }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.streak, startDate],
    queryFn: getStreak,
    staleTime: Infinity,
  });
};
