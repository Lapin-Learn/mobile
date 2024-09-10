import { SkillEnum } from '~/lib/enums';
import { IQuestionType } from '~/lib/interfaces';

import api from './httpRequests';

export type QuestionTypesSearchParams = {
  skill: SkillEnum;
};

export const getQuestionTypes = async (searchParams: QuestionTypesSearchParams) => {
  const data = await api.get<IQuestionType[]>('daily-lessons/question-types', { searchParams });
  return data;
};
