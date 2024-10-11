import { QueryFunctionContext } from '@tanstack/react-query';

import {
  IInstruction,
  ILessonQuestionsResponse,
  ILessonResult,
  ILessonsResponse,
  IQuestionType,
} from '~/lib/interfaces';

import api from '../httpRequests';

type LessonCompletionParams = {
  lessonId: number;
  correctAnswers: number;
  wrongAnswers: number;
  duration: number;
};

export const getQuestionTypes = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [, skill] = queryKey;

  try {
    const response = await api.get<IQuestionType[]>(`daily-lessons/question-types`, {
      searchParams: { skill },
    });
    return response;
  } catch (error) {
    console.error('Error fetching question types:', error);
    throw error;
  }
};

export const getLessons = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [, questionTypeId] = queryKey;

  try {
    const response = await api.get<ILessonsResponse>(`/daily-lessons/question-types/${questionTypeId}/lessons`);
    return response;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

export const getLessonQuestions = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [, lessonId] = queryKey;

  try {
    const response = await api.get<ILessonQuestionsResponse>(`/daily-lessons/lessons/${lessonId}/questions`);
    return response;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const confirmLessonCompletion = async (params: LessonCompletionParams) => {
  try {
    const response = await api.post(`/lessons/completion`, { body: params });
    return Promise.resolve(response as ILessonResult);
  } catch (error) {
    console.error('Error confirming lesson completion:', error);
    throw error;
  }
};

export const getInstruction = async ({ queryKey }: QueryFunctionContext<unknown[]>) => {
  const [, questionTypeId] = queryKey;
  const response = await api.get<IInstruction>(`/daily-lessons/question-types/${questionTypeId}/instruction`);
  return response;
};
