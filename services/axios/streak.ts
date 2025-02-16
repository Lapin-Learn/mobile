import { QueryFunctionContext } from '@tanstack/react-query';

import { IStreakHistory } from '~/lib/types';
import { getYesterday } from '~/lib/utils';

import api from '../httpRequests';

export const getStreak = async ({ queryKey }: QueryFunctionContext<any[]>) => {
  const [, startDate] = queryKey;

  try {
    const response = await api.get<IStreakHistory[]>(`streaks`, {
      searchParams: startDate ? { start: startDate } : {},
    });
    return response.map((streakHistory) => ({
      ...streakHistory,
      date:
        streakHistory.actionName === 'freeze_streak'
          ? getYesterday(new Date(streakHistory.date)).toISOString()
          : streakHistory.date,
    }));
  } catch (error) {
    console.error('Error fetching streaks:', error);
    throw error;
  }
};
