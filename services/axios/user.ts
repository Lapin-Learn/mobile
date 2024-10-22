import { IGameProfile, IPresignedUrl, IUserProfile } from '~/lib/types';

import api from '../httpRequests';
import { getTokenAsync, setTokenAsync } from '../utils';

export const getAccountIdentifier = async () => {
  const currentToken = await getTokenAsync();
  await setTokenAsync({
    accessToken:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTcyOTU3MTY0MSwiZXhwIjoxNzI5NTc1MjQxLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay04MHVib0BsYXBpbi1sZWFybi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLTgwdWJvQGxhcGluLWxlYXJuLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiQUczckhwZTA5RlJwdjhpeHNIWUx4Y1NzZVVnMiIsImNsYWltcyI6eyJkYXRhIjp7InVzZXJJZCI6ImYwNmM5YmJjLTYzODgtNGU3YS1hMWVhLTQwZWVkOWFjM2IyZCIsInByb2ZpbGVJZCI6IjJjNWQzNGI3LWRlMGEtNDVhYi05NzRmLTMxMGI2NjRjMWE4ZiIsInJvbGUiOiJsZWFybmVyIn19fQ.hCNWqmPsf_wpiGcfJEv18b_Q5YijMtA2axcT9MJw45iRmPPDcgPBQl_VBj8D2v-vjTcwQNKeHMimzJ0NzXyVXOfb4KOhS1H4slBFXPK2Ma9Gzf-4VJpdz9WuHEx1QRlG7YYywi13s4ZKAu94V_VXRNcSsUQpv4X34xYsqS0HZKG4wwDMk30tkSM5uRNdkwkJ6qqVmODXLnAzKX9jYzWtb9JU_PE8YDXiE_-W2Dtw2uaGfZ6DHR8kqVdhqlpbpQ7Pj3R-qK4bAJ3etOOqS9PUHcYVxfzYl9N_m_i_A1IBEN04EkL6d0zNIhVcQ9CLYyjs2OJ9_V9PTYqxUFcJOIj6WQ',
    refreshToken:
      'AMf-vBxU8ea7tgvV3oXRCOQNzJJBzPcmhZiu_3l-9ov6PHnL1DOJU6nvo43Y8UeuDdJIAsXyy5_WCc8c4HvzuWXzb8uKHq96n9rHHCu_idKszWjUMGhsmy4TVnIsf7RTKPuy7yzk5Lq1FTKUKPHsO1S4uq4CG3yZClg4DDh9vcY5l2n77935MCre3Zwx6nvP9PAtKG9Ra-Uq57EPc3dpKg4Xd2CoMu6nzw',
  });
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
  const data = await api.get<IGameProfile>('users/profile/gamification');
  return data;
};
