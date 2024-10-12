import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { SkillEnum } from '~/lib/enums';
import { IAfterLesson } from '~/lib/interfaces';
import { confirmLessonCompletion, getInstruction, getLessonQuestions, getLessons, getQuestionTypes } from '~/services';

import { useMilestone } from '../zustand/useMilestone';

export const useQuestionTypes = ({ skill }: { readonly skill: SkillEnum }) => {
  return useQuery({
    queryKey: ['questionTypes', skill],
    queryFn: getQuestionTypes,
  });
};

export const useListLessons = ({ questionTypeId }: { readonly questionTypeId: string }) => {
  return useQuery({
    queryKey: ['questionTypes', questionTypeId],
    queryFn: getLessons,
  });
};

export const useLessonQuestions = ({ lessonId }: { readonly lessonId: string }) => {
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

export const useLessonCompletion = () => {
  const { setMilestones } = useMilestone();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmLessonCompletion,
    onSuccess: (response: IAfterLesson) => {
      queryClient.invalidateQueries({ queryKey: ['gameProfile'] });
      queryClient.invalidateQueries({ queryKey: ['questionTypes'] });
      setMilestones(response.milestones);
    },
    onError: (error) => {
      console.error('Lesson completion mutation error:', error);
    },
  });
};
