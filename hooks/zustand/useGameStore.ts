import { create } from 'zustand';

import { ContentTypeEnum } from '~/lib/enums';
import { IMilestone, IQuestion } from '~/lib/interfaces';
import { MatchingQuestion, MultipleChoiceQuestion, PairAnswer } from '~/lib/types';

type GameState = {
  contentType: ContentTypeEnum | null;
  questions: IQuestion[];
  currentQuestion: number;
  isChecking: boolean;
  isCorrect: boolean;
  progress: number;
  isFinished: boolean;
  xp: number;
  carrots: number;
  correctAnswers: number;
  milestones: IMilestone[];
};

type GameActions = {
  setContentType: (contentType: ContentTypeEnum) => void;
  setQuestions: (questions: IQuestion[]) => void;
  setIsFinished: (isFinished: boolean) => void;
  setXp: (xp: number) => void;
  setCarrots: (carrots: number) => void;
  checkAnswer: <T extends PairAnswer | number>(selectedData?: T[]) => void;
  resetGame: () => void;
  setMilestones: (milestones: IMilestone[]) => void;
  setIsChecking: (isChecking: boolean) => void;
  setIsCorrect: (isCorrect: boolean) => void;
  setCurrentQuestion: (currentQuestion: number) => void;
  setAnswer: (answer: string[]) => void;
  setSelected: (selected: number[]) => void;
};

type InstructionStore = {
  question: string;
  explanation: string;
  answer: string[];
};

type MultipleChoiceGame = {
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
  isFinished: false,
  xp: 0,
  carrots: 0,
  correctAnswers: 0,
  question: '',
  explanation: '',
  milestones: [],
  setContentType: (contentType: ContentTypeEnum) => set({ contentType }),
  setQuestions: (questions: IQuestion[]) => set({ questions }),
  setIsFinished: (isFinished: boolean) => set({ isFinished }),
  setXp: (xp: number) => set({ xp }),
  setCarrots: (carrots: number) => set({ carrots }),

  handleSingleSelect: (index: number) => {
    const { selected } = get();
    set({ selected: selected.includes(index) ? [] : [index] });
  },
  handleMultipleSelect: (index: number) => {
    const { selected } = get();
    set({ selected: selected.includes(index) ? selected.filter((answer) => answer !== index) : [...selected, index] });
  },

  checkAnswer: <T extends PairAnswer | number>(selectedData?: T[]) => {
    const { contentType, currentQuestion, questions, correctAnswers } = get();
    const question = questions[currentQuestion];

    switch (contentType) {
      case ContentTypeEnum.MULTIPLE_CHOICE: {
        const answerIndices: number[] = question.content.answer as number[];
        set({ isChecking: true });
        set({ progress: ((currentQuestion + 1) / questions.length) * 100 });
        if (
          selectedData?.length === answerIndices.length &&
          (selectedData as number[])?.every((answer) => answerIndices.includes(answer))
        ) {
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

      case ContentTypeEnum.MATCHING: {
        const correctPairs = question.content as MatchingQuestion;
        set({ isChecking: true });
        set({ progress: ((currentQuestion + 1) / questions.length) * 100 });
        const isCorrect = (selectedData as PairAnswer[])?.every((selectedPair) => {
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

        // TODO: Set instruction store for matching game
        break;
      }
      // TODO: Add more content types

      default:
        break;
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
      isFinished: false,
      xp: 0,
      carrots: 0,
      correctAnswers: 0,
      question: '',
      explanation: '',

      answer: [],
      selected: [],
    }),
  setMilestones: (milestones: IMilestone[]) => set({ milestones }),
  setIsChecking: (isChecking: boolean) => set({ isChecking }),
  setIsCorrect: (isCorrect: boolean) => set({ isCorrect }),
  setCurrentQuestion: (currentQuestion: number) => set({ currentQuestion }),
  setAnswer: (answer: string[]) => set({ answer }),
  setSelected: (selected: number[]) => set({ selected }),
}));
