import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '~/lib/constants';
import { analytics } from '~/lib/services';
import { getMissions, postMissionReward } from '~/services/axios/mission';

export const useMissions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.missions],
    queryFn: getMissions,
    staleTime: Infinity,
  });
};

export const useMissionReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postMissionReward,
    onSuccess: (data) => {
      analytics.logEarnVirtualCurrency({
        virtual_currency_name: 'carrot',
        value: data.bonusCarrot,
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.missions] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profile.game] });
    },
    onError: (error) => {
      console.error('Mission reward mutation error:', error);
    },
  });
};
