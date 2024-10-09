import { QueryFunctionContext } from '@tanstack/react-query';

import { IHistoryStreak } from '~/lib/interfaces';

import api from './httpRequests';

export const getHistoryStreak = async ({ queryKey }: QueryFunctionContext<any[]>) => {
  const [, start] = queryKey;
  try {
    const response = await api.get<IHistoryStreak[]>(`/streaks`, {
      searchParams: { start },
    });
    return response;
  } catch (error) {
    console.error('Error fetching history streak:', error);
    throw error;
  }
};
