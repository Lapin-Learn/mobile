import { QueryFunctionContext } from '@tanstack/react-query';

import { IQuestionType } from '~/lib/interfaces';

import api from './httpRequests';

export const getQuestionTypes = async ({ queryKey }: QueryFunctionContext<any[]>) => {
  const [, searchParams] = queryKey;
  const data = await api.get<IQuestionType[]>('daily-lessons/question-types', searchParams);
  return data;
};
