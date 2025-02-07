import { QueryFunctionContext } from '@tanstack/react-query';

import { IInstruction, ILesson, ILessonResult, IQuestionType } from '~/lib/types';
import { IQuestion } from '~/lib/types/questions';

import api from '../httpRequests';

type LessonCompletionParams = {
  lessonId: number;
  correctAnswers: number;
  wrongAnswers: number;
  duration: number;
};

export const getQuestionTypes = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [, , skill] = queryKey;

  return await api.get<IQuestionType[]>(`daily-lessons/question-types`, {
    searchParams: { skill },
  });
};

type ILessonsResponse = {
  lessons: ILesson[];
  totalLearningDuration: number;
};

export const getLessons = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [, , questionTypeId] = queryKey;

  return await api.get<ILessonsResponse>(`/daily-lessons/question-types/${questionTypeId}/lessons`);
};

type ILessonQuestionsResponse = {
  id: number;
  name: string;
  order: number;
  questionToLessons: {
    order: number;
    question: IQuestion;
    questionId: string;
  }[];
};

export const getLessonQuestions = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [, lessonId] = queryKey;
  return await api.get<ILessonQuestionsResponse>(`/daily-lessons/${lessonId}/questions`);
};

export const confirmLessonCompletion = async (params: LessonCompletionParams) => {
  return await api.post<ILessonResult>(`/daily-lessons/completion`, { body: params });
};

export const getInstruction = async ({ queryKey }: QueryFunctionContext<unknown[]>) => {
  const [, , questionTypeId] = queryKey;
  return await api.get<IInstruction>(`/daily-lessons/question-types/${questionTypeId}/instruction`);
};
