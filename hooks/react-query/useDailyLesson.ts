import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { SkillEnum } from '~/lib/enums';
import { IAfterLesson } from '~/lib/interfaces';
import { confirmLessonCompletion, getInstruction, getLessonQuestions, getLessons, getQuestionTypes } from '~/services';

import { useGameStore } from '../zustand';

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
  const { setXp, setCarrots, setMilestones } = useGameStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmLessonCompletion,
    onSuccess: (response: IAfterLesson) => {
      setXp(response.bonusXP);
      setCarrots(response.bonusCarrot);
      queryClient.invalidateQueries({ queryKey: ['gameProfile'] });
      setMilestones(response.milestones);
    },
    onError: (error) => {
      console.error('Lesson completion mutation error:', error);
    },
  });
};
