import { QueryFunctionContext } from '@tanstack/react-query';

import { ILessonsResponse, IQuestionType } from '~/lib/interfaces';

import api from './httpRequests';

export const getQuestionTypes = async ({ queryKey }: QueryFunctionContext<any[]>) => {
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

export const getLessons = async ({ queryKey }: QueryFunctionContext<any[]>) => {
  const [, questionTypeId] = queryKey;

  try {
    const response = await api.get<ILessonsResponse>(`/daily-lessons/questions-types/${questionTypeId}/lessons`);
    return response;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

export const getLessonQuestions = async ({ queryKey }: QueryFunctionContext<any[]>) => {
  const [, lessonId] = queryKey;

  try {
    const response = await api.get(`/daily-lessons/lessons/${lessonId}/questions`);
    return response;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};
