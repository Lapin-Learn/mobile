import { QuestionTypesSearchParams } from '~/types';
import api from './httpRequests';
import { IQuestionType } from '~/interfaces';

export const getQuestionTypes = async (searchParams: QuestionTypesSearchParams) => {
  const data = await api.get<IQuestionType[]>('daily-lessons/question-types', { searchParams });
  return data;
};
