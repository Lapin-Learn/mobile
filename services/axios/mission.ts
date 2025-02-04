import { MissionCategoryEnum } from '~/lib/enums';
import { IMission, IMissionReward } from '~/lib/types';

import { default as api } from '../httpRequests';

export const parseMission = (mission: IMission) => {
  switch (mission.category) {
    case MissionCategoryEnum.TOTAL_DURATION_OF_LEARN_DAILY_LESSON:
      return {
        ...mission,
        current: Math.round(mission.current / 60),
        quantity: Math.round(mission.quantity / 60),
      };
    default:
      return mission;
  }
};

export const getMissions = async () => {
  const response = await api.get<IMission[]>('missions');
  return response.map(parseMission);
};

export const postMissionReward = async () => {
  return await api.post<IMissionReward>('missions/receive');
};
