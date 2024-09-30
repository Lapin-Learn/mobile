import { IUserProfile } from '~/lib/interfaces';

import api from './httpRequests';

export const getUserProfile = async () => {
  const data = await api.get<IUserProfile>('users/profile');
  return data;
};

export const updateUserProfile = async (params: Partial<IUserProfile>) => {
  await api.put('users/profile', {
    body: {
      body: params,
    },
  });
};
