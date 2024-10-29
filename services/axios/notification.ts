import api from '../httpRequests';

type SendFcmTokenPayloads = {
  token: string;
};

export async function sendFcmToken(payload: SendFcmTokenPayloads) {
  return api.post<string>('/notifications/fcm-token', { body: payload });
}
