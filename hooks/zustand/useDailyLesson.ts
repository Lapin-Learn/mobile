import { create } from 'zustand';

import { IQuestionType } from '~/lib/interfaces';

type DailyLessonState = {
  exerciseId: null;
  questionTypeId: null;
  currentQuestionType: IQuestionType;
};

type DailyLessonActions = {
  setCurrentQuestionType: (questionType: IQuestionType) => void;
};

export const useDailyLesson = create<DailyLessonState & DailyLessonActions>((set) => ({
  exerciseId: null,
  questionTypeId: null,
  currentQuestionType: {} as IQuestionType,
  setCurrentQuestionType: (questionType: IQuestionType) => set({ currentQuestionType: questionType }),
}));
