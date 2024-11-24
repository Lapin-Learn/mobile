import { Audio } from 'expo-av';
import { create } from 'zustand';

import { IIPAResult } from '~/lib/types';
import { deleteUri } from '~/lib/utils/fileSystem';

export enum SpeakingSoundType {
  QUESTION = 'question',
  ANSWER = 'answer',
  IDLE = 'idle',
  SEND = 'send',
}

type AudioState = {
  recording: Audio.Recording | null;
  status: Audio.RecordingStatus | null;
  uri?: string | null;
  soundType: SpeakingSoundType;
  result?: Pick<IIPAResult, 'correct_letters' | 'original_ipa_transcript' | 'original_transcript'>;
};

type AudioAction = {
  setRecord: ({ recording, status }: Pick<AudioState, 'recording' | 'status'>) => void;
  stopRecord: () => Promise<void>;
  setUri: (uri: Pick<AudioState, 'uri'>) => void;
  setSoundType: (soundType: SpeakingSoundType) => void;
  initState: () => void;
  setResult: (result?: Pick<IIPAResult, 'correct_letters' | 'original_ipa_transcript' | 'original_transcript'>) => void;
};

export const useSpeakingStore = create<AudioState & AudioAction>((set, get) => ({
  recording: null,
  status: null,
  uri: undefined,
  soundType: SpeakingSoundType.IDLE,
  result: undefined,
  initState: () => {
    set({ recording: null, status: null, uri: undefined, soundType: SpeakingSoundType.IDLE });
  },
  setRecord: ({ recording, status }) => {
    set({ recording, status });
  },
  stopRecord: async () => {
    const { recording, uri, setRecord } = get();
    if (recording) {
      await recording.stopAndUnloadAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      setRecord({ recording: null, status: null });
    }

    if (uri) deleteUri(uri!);
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
