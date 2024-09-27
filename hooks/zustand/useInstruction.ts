import { create } from 'zustand';

import { ContentTypeEnum } from '~/lib/enums';

type InstructionStore = {
  contentType: ContentTypeEnum;
  question: string;
  explanation: string;
  answers: string[];
};

type InstructionActions = {
  setContentType: (contentType: ContentTypeEnum) => void;
  setQuestion: (question: string) => void;
  setExplanation: (explanation: string) => void;
  setAnswers: (answers: string[]) => void;
};

export const useInstruction = create<InstructionStore & InstructionActions>((set) => ({
  contentType: ContentTypeEnum.MULTIPLE_CHOICE,
  question: '',
  explanation: '',
  answers: [],
  setContentType: (contentType: ContentTypeEnum) => set({ contentType }),
  setQuestion: (question: string) => set({ question }),
  setExplanation: (explanation: string) => set({ explanation }),
  setAnswers: (answers: string[]) => set({ answers }),
}));
