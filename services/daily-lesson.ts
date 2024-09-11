import { QuestionTypesSearchParams } from '~/types';
import api from './httpRequests';
import { IQuestionType } from '~/interfaces';
import { QueryFunctionContext } from '@tanstack/react-query';

export const getQuestionTypes = async ({ queryKey }: QueryFunctionContext<any[]>) => {
  const [, searchParams] = queryKey;
  const data = await api.get<IQuestionType[]>('daily-lessons/question-types', searchParams);
  return data;
};
