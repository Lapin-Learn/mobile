import { MissionCategoryEnum } from '~/lib/enums';
import { IMission, IMissionReward } from '~/lib/types';

import { default as api } from '../httpRequests';

export const getMissions = async () => {
  try {
    const response = await api.get<IMission[]>(`missions`);
    return response.map((mission) => ({
      ...mission,
      current:
        mission.category === MissionCategoryEnum.TOTAL_DURATION_OF_LEARN_DAILY_LESSON
          ? Math.min(1, mission.current)
          : mission.current,
      quantity: mission.category === MissionCategoryEnum.TOTAL_DURATION_OF_LEARN_DAILY_LESSON ? 1 : mission.quantity,
    }));
  } catch (error) {
    console.error('Error fetching question types:', error);
    throw error;
  }
};

export const postMissionReward = async () => {
  try {
    const response = await api.post<IMissionReward>(`missions/receive`);
    return response;
  } catch (error) {
    console.error('Error fetching question types:', error);
    throw error;
  }
};
