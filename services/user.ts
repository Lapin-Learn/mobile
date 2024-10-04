import { IGameProfile, IPresignedUrl, IUserProfile } from '~/lib/interfaces';

import api from './httpRequests';

export const getUserProfile = async () => {
  const data = await api.get<IUserProfile>('users/profile');
  return data;
};

export const updateUserProfile = async (data: Partial<IUserProfile>) => {
  await api.put('users/profile', { body: { body: data } });
};

export const createPreSignedUrl = async (data: { name: string }) => {
  const response = await api.post<IPresignedUrl>('files/presigned-url', { body: data });
  return response;
};

export const uploadAvatar = async (data: { presignedUrl: IPresignedUrl; file: ArrayBuffer }) => {
  await api.putImage(data.presignedUrl.url, { body: data.file }).then(async () => {
    await api.post('files/confirmation', { body: { id: data.presignedUrl.id } });
  });
};

export const createUpdatePreSignedUrl = async (data: { name: string; uuid: string }) => {
  const response = await api.put<IPresignedUrl>(`files/presigned-url/${data.uuid}`, { body: { name: data.name } });
  return response;
};

export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  await api.put('users/profile/password', { body: data });
};

export const getGameProfile = async () => {
  const data = await api.get<IGameProfile>('users/profile/gamification');
  return data;
};
