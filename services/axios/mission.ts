import { IMission, IMissionReward } from '~/lib/types';

import api from '../httpRequests';

export const getMissions = async () => {
  try {
    const response = await api.get<IMission[]>(`missions`);
    return response;
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
