import { useQuery } from '@tanstack/react-query';

import { SkillEnum } from '~/lib/enums';
import { getLessons, getQuestionTypes } from '~/services';

export const useQuestionTypes = ({ skill }: { readonly skill: SkillEnum }) => {
  return useQuery({
    queryKey: ['questionTypes', skill],
    queryFn: getQuestionTypes,
  });
};

export const useListLessons = ({ questionTypeId }: { readonly questionTypeId: string }) => {
  return useQuery({
    queryKey: ['lessons', questionTypeId],
    queryFn: getLessons,
  });
};
