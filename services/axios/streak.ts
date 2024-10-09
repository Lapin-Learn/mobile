import { QueryFunctionContext } from '@tanstack/react-query';

import { IStreakHistory } from '~/lib/interfaces';

import api from '../httpRequests';

export const getStreak = async ({ queryKey }: QueryFunctionContext<any[]>) => {
  const [, startDate] = queryKey;

  try {
    const response = await api.get<IStreakHistory[]>(`streaks`, {
      searchParams: startDate ? { start: startDate } : {},
    });
    return response;
  } catch (error) {
    console.error('Error fetching question types:', error);
    throw error;
  }
};
