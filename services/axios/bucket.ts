import { IPresignedUrl } from '~/lib/types';

import api from '../httpRequests';

export const createUpdatePresignedUrl = async (data: { name: string; uuid: string }) => {
  return api.put<IPresignedUrl>(`files/presigned-url/${data.uuid}`, { body: { name: data.name } });
};

export const createPresignedUrl = async (data: { name: string }) => {
  return await api.post<IPresignedUrl>('files/presigned-url', { body: data });
};
