import { Platform } from 'react-native';
import { create } from 'zustand';

import { ContentTypeEnum } from '~/lib/enums';
import { IQuestion } from '~/lib/interfaces';
import { getDuration } from '~/lib/utils';

type GameState = {
  contentType: ContentTypeEnum | null;
  questions: IQuestion[];
  currentQuestion: number;
  isChecking: boolean;
  isCorrect: boolean;
  progress: number;
  startTime: Date | null;
  endTime: number;
  isFinished: boolean;
  xp: number;
  carrots: number;
  correctAnswers: number;
};

type GameActions = {
  setContentType: (contentType: ContentTypeEnum) => void;
  setQuestions: (questions: IQuestion[]) => void;
  setStartTime: (startTime: Date | null) => void;
  setIsFinished: (isFinished: boolean) => void;
  setXp: (xp: number) => void;
  setCarrots: (carrots: number) => void;
  checkAnswer: () => void;
  nextQuestion: () => void;
  resetGame: () => void;
};

type InstructionStore = {
  question: string;
  explanation: string;
};

type MultipleChoiceGame = {
  answer: string[];
  selected: number[];
  handleSingleSelect: (index: number) => void;
  handleMultipleSelect: (index: number) => void;
};

export type GameStore = GameState & GameActions & InstructionStore & MultipleChoiceGame;

export const useGameStore = create<GameStore>((set, get) => ({
  contentType: null,
  questions: [],
  currentQuestion: 0,
  answer: [],
  selected: [],
  isChecking: false,
  isCorrect: false,
  progress: 0,
  startTime: null,
  endTime: 0,
  isFinished: false,
  xp: 0,
  carrots: 0,
  correctAnswers: 0,
  question: '',
  explanation: '',
  setContentType: (contentType: ContentTypeEnum) => set({ contentType }),
  setQuestions: (questions: IQuestion[]) => set({ questions }),
  setStartTime: (startTime: Date | null) => set({ startTime }),
  setIsFinished: (isFinished: boolean) => set({ isFinished }),
  setXp: (xp: number) => set({ xp }),
  setCarrots: (carrots: number) => set({ carrots }),
  handleSingleSelect: (index: number) => {
    if (index === null) return;
    set({ selected: [index] });
  },
  handleMultipleSelect: (index: number) => {
    const { selected } = get();
    if (index === null) return;
    set({ selected: selected.includes(index) ? selected.filter((answer) => answer !== index) : [...selected, index] });
  },
  checkAnswer: () => {
    const { contentType, currentQuestion, questions, selected, correctAnswers } = get();
    switch (contentType) {
      case ContentTypeEnum.MULTIPLE_CHOICE: {
        const answerIndices: number[] = questions[currentQuestion].content.answer;
        set({ isChecking: true });
        set({ progress: ((currentQuestion + 1) / questions.length) * 100 });
        if (selected.length === answerIndices.length && selected.every((answer) => answerIndices.includes(answer))) {
          set({ isCorrect: true });
          set({ correctAnswers: correctAnswers + 1 });
        } else {
          set({ isCorrect: false });
        }

        // Set instruction store
        set({ question: questions[currentQuestion]?.content.question });
        set({ answer: answerIndices.map((index: number) => questions[currentQuestion].content.options[index]) });
        set({ explanation: questions[currentQuestion]?.explanation });
        break;
      }
      // TODO: Add more content types
      default:
        break;
    }
  },
  nextQuestion: () => {
    const { currentQuestion, questions, startTime } = get();
    if (currentQuestion === questions.length - 1) {
      if (Platform.OS === 'ios') {
        set({ isChecking: false });
        set({ isCorrect: false });
      }
      if (startTime !== null) set({ endTime: getDuration(startTime) });
    } else {
      set((state) => ({ currentQuestion: state.currentQuestion + 1 }));
      set({ selected: [] });
      set({ answer: [] });
      set({ isChecking: false });
      set({ isCorrect: false });
    }
  },
  resetGame: () =>
    set({
      contentType: null,
      questions: [],
      currentQuestion: 0,
      answer: [],
      selected: [],
      isChecking: false,
      isCorrect: false,
      progress: 0,
      startTime: null,
      endTime: 0,
      isFinished: false,
      xp: 0,
      carrots: 0,
      correctAnswers: 0,
      question: '',
      explanation: '',
    }),
}));
