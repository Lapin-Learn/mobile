import { IGameProfile, IPresignedUrl, IUserProfile } from '~/lib/types';

import api from '../httpRequests';

export const getAccountIdentifier = async () => {
  const data = await api.get<Pick<IUserProfile, 'username' | 'fullName' | 'gender' | 'dob' | 'email'>>('users/account');
  return data;
};
export const getUserProfile = async () => {
  const data = await api.get<IUserProfile>('users/profile');
  return data;
};

export const updateUserProfile = async (data: Partial<IUserProfile>) => {
  return await api.put<IUserProfile>('users/profile', { body: { body: data } });
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
  // console.log('Call game');
  // await setTokenAsync({
  //   accessToken:
  //     'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTcyOTY5MjA5MSwiZXhwIjoxNzI5Njk1NjkxLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay04MHVib0BsYXBpbi1sZWFybi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLTgwdWJvQGxhcGluLWxlYXJuLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiQUczckhwZTA5RlJwdjhpeHNIWUx4Y1NzZVVnMiIsImNsYWltcyI6eyJkYXRhIjp7InVzZXJJZCI6ImYwNmM5YmJjLTYzODgtNGU3YS1hMWVhLTQwZWVkOWFjM2IyZCIsInByb2ZpbGVJZCI6IjJjNWQzNGI3LWRlMGEtNDVhYi05NzRmLTMxMGI2NjRjMWE4ZiIsInJvbGUiOiJsZWFybmVyIn19fQ.T2as5JxdFOPBLWpa7RAN9vjRUfYNJWwFodnFt48Rr_7KyqSPBiHAOBX0pXIdmftNtevv0Dh3e-cX5dDZylPAPqV-Pp7yerFpK8pkV5-02hlqJE632v12d_0wSjNY0FSLO0P1CVRG5SXLM_leJTs9MUSlGuI92IlRSg2q9RoovVYqSTJVD8zuOL07e6XZT83ro-nUltqUePJu7wh4fhlOejeql5nGmkrSeOGqj3O64Z6lrWrhR0LRVUiyRQpwQ3u8qYGXPIT4seWp0IpPeS1v2HFaCqSoXlXGAsdACOgeZSZ6KRZvMQA9dtkG2DenAEt-P9OmtftxFEbgbkhgda5ffw',
  //   refreshToken:
  //     'AMf-vBwN_EokW8YmtmEIrzQKvGpvLsGgAYXP2x6h0n9EaYw-VrFsrGpFeJ-qY2PX3-afUfmcfA12kMNBAx8XFSZgjWCXCcHNj4hTPe5bYw_j-nTZYcvATW-UCj19VBFgZAs8Q7vZseyMcqi5TH7t7R5sVFR7BxqJcbEtjk8L2RStz2wL8DZEhvCbruL1o-5BiICBcALR3Y2y2ikQfHqxgWU-Vg3kMW1mqw',
  // });
  // console.log('getAccountIdentifier', (await getTokenAsync())?.accessToken?.slice(-10));
  const data = await api.get<IGameProfile>('users/profile/gamification');
  return data;
};
