import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '~/lib/constants';
import { SkillEnum } from '~/lib/enums';
import { confirmLessonCompletion, getInstruction, getLessonQuestions, getLessons, getQuestionTypes } from '~/services';

import { useMilestoneStore } from '../zustand/useMilestoneStore';

export const useQuestionTypes = ({ skill }: { skill: SkillEnum }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.questionTypes, QUERY_KEYS.list, skill],
    queryFn: getQuestionTypes,
  });
};

export const useListLessons = ({ questionTypeId }: { questionTypeId: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.questionTypes, QUERY_KEYS.detail, questionTypeId],
    queryFn: getLessons,
  });
};

export const useLessonQuestions = ({ lessonId }: { lessonId: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.lessonQuestions, lessonId],
    queryFn: getLessonQuestions,
    staleTime: Infinity,
  });
};

export const useInstruction = ({ questionTypeId }: { questionTypeId: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.questionTypes, QUERY_KEYS.instruction, questionTypeId],
    queryFn: getInstruction,
    staleTime: Infinity,
  });
};

export const useLessonCompletion = () => {
  const { setMilestones } = useMilestoneStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmLessonCompletion,
    onSuccess: ({ milestones }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profile.game] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.questionTypes] });
      setMilestones(milestones);
    },
    onError: (error) => {
      console.error('Lesson completion mutation error:', error);
    },
  });
};
