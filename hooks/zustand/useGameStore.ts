import { create } from 'zustand';

import { ContentTypeEnum } from '~/lib/enums';
import { IQuestion } from '~/lib/interfaces';
import { MatchingQuestion, MultipleChoiceQuestion, PairAnswer } from '~/lib/types';
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
  checkAnswer: (selectedData?: PairAnswer[]) => void;
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

type MatchingGame = {};

export type GameStore = GameState & GameActions & InstructionStore & (MultipleChoiceGame & MatchingGame);

export const useGameStore = create<GameStore>((set, get) => ({
  answer: [],
  selected: [],

  contentType: null,
  questions: [],
  currentQuestion: 0,
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

  checkAnswer: (selectedData) => {
    const { contentType, currentQuestion, questions, selected, correctAnswers } = get();
    const question = questions[currentQuestion];
    switch (contentType) {
      case ContentTypeEnum.MULTIPLE_CHOICE: {
        const answerIndices: number[] = question.content.answer as number[];
        set({ isChecking: true });
        set({ progress: ((currentQuestion + 1) / questions.length) * 100 });
        if (selected.length === answerIndices.length && selected.every((answer) => answerIndices.includes(answer))) {
          set({ isCorrect: true });
          set({ correctAnswers: correctAnswers + 1 });
        } else {
          set({ isCorrect: false });
        }

        // Set instruction store
        set({ question: question?.content.question });
        set({
          answer: answerIndices.map((index: number) => (question.content as MultipleChoiceQuestion).options[index]),
        });
        set({ explanation: question?.explanation });
        break;
      }
      // TODO: Add more content types
      case ContentTypeEnum.MATCHING: {
        const correctPairs = question.content as MatchingQuestion;
        set({ isChecking: true });
        set({ progress: ((currentQuestion + 1) / questions.length) * 100 });
        const isCorrect = selectedData?.every((selectedPair) => {
          const correctPair = correctPairs.answer.find(
            (pair) =>
              pair.columnA.every((columnAIndex) => selectedPair.columnA.includes(columnAIndex)) &&
              pair.columnB.every((columnBIndex) => selectedPair.columnB.includes(columnBIndex))
          );
          return correctPair !== undefined;
        });

        if (isCorrect) {
          set({ isCorrect: true });
          set({ correctAnswers: correctAnswers + 1 });
        } else {
          set({ isCorrect: false });
        }
      }
      default:
        break;
    }
  },
  nextQuestion: () => {
    const { currentQuestion, questions, startTime, contentType } = get();
    set({ isChecking: false });
    set({ isCorrect: false });
    if (currentQuestion === questions.length - 1) {
      if (startTime !== null) set({ endTime: getDuration(startTime) });
    } else {
      set((state) => ({ currentQuestion: state.currentQuestion + 1 }));
      switch (contentType) {
        case ContentTypeEnum.MULTIPLE_CHOICE: {
          set({ selected: [], answer: [] });
        }
        case ContentTypeEnum.MATCHING: {
          break;
        }
      }
    }
  },
  resetGame: () =>
    set({
      contentType: null,
      questions: [],
      currentQuestion: 0,
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

      answer: [],
      selected: [],
    }),
}));
