import api from '../httpRequests';

type SendFcmTokenPayloads = {
  token: string | null;
};

export async function sendFcmToken(payload: SendFcmTokenPayloads) {
  return api.post<string>('/notifications/fcm-token', { body: payload });
}

export async function deleteFcmToken() {
  const payload = {
    token: null,
  };
  return api.post<string>('/notifications/fcm-token', { body: payload });
}
