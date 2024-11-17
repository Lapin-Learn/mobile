import { Audio } from 'expo-av';
import { ViewProps } from 'react-native';
import { create } from 'zustand';

export enum SpeakingSoundType {
  QUESTION = 'question',
  ANSWER = 'answer',
  IDLE = 'idle',
  SEND = 'send',
}

export type VoiceRecordingProps = ViewProps & {
  recording?: Audio.Recording;
  status?: Audio.RecordingStatus;
  uri?: string | null;
  setRecord: (record?: Audio.RecordingObject) => void;
  setUri?: (uri?: string | null) => void;
  isPlaySound?: boolean;
  setIsPlaySound?: () => void;
};

type AudioState = {
  recording?: Audio.Recording;
  status?: Audio.RecordingStatus;
  uri?: string | null;
  soundType: SpeakingSoundType;
};

type AudioAction = {
  setRecord: ({ recording, status }: Pick<AudioState, 'recording' | 'status'>) => void;
  setUri: (uri: Pick<AudioState, 'uri'>) => void;
  setSoundType: (soundType: SpeakingSoundType) => void;
  initState: () => void;
};

export const useAudioStore = create<AudioState & AudioAction>((set) => ({
  recording: undefined,
  status: undefined,
  uri: null,
  soundType: SpeakingSoundType.IDLE,
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
}));
