import { ISpeakingService } from '~/lib/types';

import api from '../httpRequests';

type SpeakingEvaluation = {
  original: string;
  uri: string;
};

export const evaluateSpeaking = async (params: SpeakingEvaluation) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: params.uri,
      name: 'recording.wav',
      type: 'audio/wav',
    } as unknown as Blob);
    formData.append('original', params.original);

    const response = await api.postForm<ISpeakingService>(`/ai/speaking/speech-evaluation`, {
      body: formData,
    });
    return response;
  } catch (error) {
    console.error('Error evaluating speaking:', error);
    throw error;
  }
};
