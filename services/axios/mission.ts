import { MissionCategoryEnum } from '~/lib/enums';
import { IMission, IMissionReward } from '~/lib/types';

import { default as api } from '../httpRequests';

const checkMissionEnum = (category: MissionCategoryEnum) => {
  return (
    category === MissionCategoryEnum.TOTAL_DURATION_OF_LEARN_DAILY_LESSON ||
    category === MissionCategoryEnum.COMPLETE_LESSON_WITH_DIFFERENT_SKILLS
  );
};

export const getMissions = async () => {
  try {
    const response = await api.get<IMission[]>(`missions`);
    return response.map((mission) => ({
      ...mission,
      current: checkMissionEnum(mission.category) ? Math.min(1, mission.current) : mission.current,
      quantity: checkMissionEnum(mission.category) ? 1 : mission.quantity,
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
