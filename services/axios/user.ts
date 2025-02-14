import { IAccountIdentifer, IGameProfile, IPresignedUrl, IUserProfile } from '~/lib/types';

import api from '../httpRequests';

export const getAccountIdentifier = async () => {
  const data = await api.get<IAccountIdentifer>('users/account');
  return data;
};
export const getUserProfile = async () => {
  const data = await api.get<IUserProfile>('users/profile');
  return data;
};

export const updateUserProfile = async (data: Partial<IUserProfile>) => {
  return await api.put<IUserProfile>('users/profile', { body: { body: data } });
};

export const uploadAvatar = async (data: { presignedUrl: IPresignedUrl; file: ArrayBuffer }) => {
  await api.putImage(data.presignedUrl.url, { body: data.file }).then(async () => {
    await api.post('files/confirmation', { body: { id: data.presignedUrl.id } });
  });
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  await api.put('users/profile/password', { body: data });
};

export const getGameProfile = async () => {
  const data = await api.get<IGameProfile>('users/profile/gamification');
  return data;
};

export const deleteAccount = async () => {
  const data = await api.delete('users/account');
  return data;
};
