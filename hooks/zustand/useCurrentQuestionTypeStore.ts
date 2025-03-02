import { create } from 'zustand';

import { IQuestionType } from '~/lib/types';

type DailyLessonState = {
  exerciseId: string | null;
  currentQuestionType: IQuestionType | null;
};

type DailyLessonActions = {
  setCurrentQuestionType: (currentQuestionType: DailyLessonState['currentQuestionType']) => void;
};

export const useCurrentQuestionTypeStore = create<DailyLessonState & DailyLessonActions>((set) => ({
  exerciseId: null,
  currentQuestionType: {} as IQuestionType,
  setCurrentQuestionType: (currentQuestionType: DailyLessonState['currentQuestionType']) =>
    set({ currentQuestionType }),
}));
