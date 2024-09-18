import { IUserProfile } from '~/lib/interfaces';

import api from './httpRequests';

export const getUserProfile = async () => {
  const data = await api.get<IUserProfile>('users/profile');
  return data;
};

export const updateUserProfile = async (
  data: Omit<IUserProfile, 'fullName' | 'dob' | 'gender'> & {
    fullName?: string;
    dob?: string;
    gender?: 'male' | 'female' | 'other';
  }
) => {
  await api.put('users/profile', { body: data });
};
