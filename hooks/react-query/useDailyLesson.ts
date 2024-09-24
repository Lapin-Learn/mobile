import { useQuery } from '@tanstack/react-query';

import { SkillEnum } from '~/lib/enums';
import { getLessonQuestions, getLessons, getQuestionTypes, getInstruction } from '~/services';

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

export const useLessonQuestions = ({ lessonId }: { readonly lessonId: number }) => {
  return useQuery({
    queryKey: ['lessonQuestions', lessonId],
    queryFn: getLessonQuestions,
  });
};

export const useInstruction = ({ questionTypeId }: { readonly questionTypeId: string }) => {
  return useQuery({
    queryKey: ['instruction', questionTypeId],
    queryFn: getInstruction,
  });
};
