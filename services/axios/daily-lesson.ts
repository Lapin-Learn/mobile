import { QueryFunctionContext } from '@tanstack/react-query';

import { IInstruction, ILesson, ILessonResult, IQuestionType } from '~/lib/types';
import { IQuestion } from '~/lib/types/questions';

import api from '../httpRequests';

type LessonCompletionParams = {
  lessonId: number;
  correctAnswers: number;
  wrongAnswers: number;
  duration: number;
  isJumpBand?: boolean;
};

export const getQuestionTypes = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [, , skill] = queryKey;

  return await api.get<IQuestionType[]>('daily-lessons/question-types', {
    searchParams: { skill },
  });
};

type ILessonsResponse = {
  lessons: ILesson[];
  totalLearningDuration: number;
};

export const getLessons = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [, , questionTypeId, bandScore] = queryKey;

  return api.get<ILessonsResponse>(`/daily-lessons/question-types/${questionTypeId}/lessons`, {
    searchParams: { band: bandScore },
  });
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
  return api.get<ILessonQuestionsResponse>(`/daily-lessons/${lessonId}/questions`);
};

type IJumpBandQuestionsResponse = {
  lastLessonId: number;
  questions: IQuestion[];
};

export const getJumpBandQuestions = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [, questionTypeId] = queryKey;
  return api.get<IJumpBandQuestionsResponse>(`/daily-lessons/question-types/${questionTypeId}/band-upgrade-questions`);
};

export const confirmLessonCompletion = async (params: LessonCompletionParams) => {
  return api.post<ILessonResult>(`/daily-lessons/completion`, { body: params });
};

export const getInstruction = async ({ queryKey }: QueryFunctionContext<unknown[]>) => {
  const [, , questionTypeId] = queryKey;
  return api.get<IInstruction>(`/daily-lessons/question-types/${questionTypeId}/instruction`);
};
