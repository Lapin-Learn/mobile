import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import Styles from '~/constants/GlobalStyles';
import { QUERY_KEYS } from '~/lib/constants';
import { buyItem, getInventory, getShop, useItem } from '~/services/axios/item';

import { useToast } from '../useToast';

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

export const useUseInventoryItem = () => {
  const client = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation('item');

  return useMutation({
    mutationFn: useItem,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [QUERY_KEYS.inventory] });
      client.invalidateQueries({ queryKey: [QUERY_KEYS.profile.game] });
    },
    onError: (response) => {
      toast.show({
        type: 'error',
        text1: t(`streak_freeze.${response.message}`),
        text1Style: { ...Styles.color.red[500] },
      });
    },
  });
};
