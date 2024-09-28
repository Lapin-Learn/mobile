import { IPresignedUrl, IUserProfile } from '~/lib/interfaces';

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
