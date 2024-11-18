import { Audio } from 'expo-av';
import { create } from 'zustand';

import { IIPAResult } from '~/lib/types';

export enum SpeakingSoundType {
  QUESTION = 'question',
  ANSWER = 'answer',
  IDLE = 'idle',
  SEND = 'send',
}

type AudioState = {
  recording?: Audio.Recording;
  status?: Audio.RecordingStatus;
  uri?: string | null;
  soundType: SpeakingSoundType;
  result?: Pick<IIPAResult, 'correct_letters' | 'original_ipa_transcript' | 'original_transcript'>;
};

type AudioAction = {
  setRecord: ({ recording, status }: Pick<AudioState, 'recording' | 'status'>) => void;
  setUri: (uri: Pick<AudioState, 'uri'>) => void;
  setSoundType: (soundType: SpeakingSoundType) => void;
  initState: () => void;
  setResult: (result?: Pick<IIPAResult, 'correct_letters' | 'original_ipa_transcript' | 'original_transcript'>) => void;
};

export const useSpeakingStore = create<AudioState & AudioAction>((set) => ({
  recording: undefined,
  status: undefined,
  uri: null,
  soundType: SpeakingSoundType.IDLE,
  result: undefined,
  initState: () => {
    set({ recording: undefined, status: undefined, uri: null, soundType: SpeakingSoundType.IDLE });
  },
  setRecord: ({ recording, status }) => {
    set({ recording, status });
  },
  setUri: (uri) => {
    set(uri);
  },
  setSoundType: (soundType) => {
    set({ soundType });
  },
  setResult: (result) => {
    set({ result });
  },
}));
