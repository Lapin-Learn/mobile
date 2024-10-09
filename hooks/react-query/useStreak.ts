import { useQuery } from '@tanstack/react-query';

import { getStreak } from '~/services/axios/streak';

export const useStreaks = ({ startDate }: { readonly startDate: string | null }) => {
  return useQuery({
    queryKey: ['streaks', startDate],
    queryFn: getStreak,
  });
};
