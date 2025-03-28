import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '~/lib/constants';
import { BandScoreEnum, SkillEnum } from '~/lib/enums';
import {
  confirmLessonCompletion,
  getInstruction,
  getJumpBandQuestions,
  getLessonQuestions,
  getLessons,
  getQuestionTypes,
} from '~/services';
import { evaluateSpeaking } from '~/services/axios/speaking-service';

import { useMilestoneStore } from '../zustand/useMilestoneStore';

export const useQuestionTypes = ({ skill }: { skill: SkillEnum }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.questionTypes, QUERY_KEYS.list, skill],
    queryFn: getQuestionTypes,
  });
};

export const useListLessons = ({
  questionTypeId,
  bandScore,
  enabled,
}: {
  questionTypeId: string;
  bandScore: BandScoreEnum;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.questionTypes, QUERY_KEYS.detail, questionTypeId, bandScore],
    queryFn: getLessons,
    enabled,
  });
};

export const useLessonQuestions = ({ lessonId }: { lessonId: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.lessonQuestions, lessonId],
    queryFn: getLessonQuestions,
    staleTime: 0,
  });
};

export const useJumpBandQuestions = ({ questionTypeId }: { questionTypeId: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.jumpBandQuestions, questionTypeId],
    queryFn: getJumpBandQuestions,
    staleTime: 0,
    enabled: !!questionTypeId,
  });
};

export const useInstruction = ({ questionTypeId }: { questionTypeId: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.questionTypes, QUERY_KEYS.instruction, questionTypeId],
    queryFn: getInstruction,
    staleTime: 0,
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.streak] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.missions] });
      setMilestones(milestones);
    },
    onError: (error) => {
      console.error('Lesson completion mutation error:', error);
    },
  });
};

export const useSpeakingEvaluation = () => {
  return useMutation({
    mutationFn: evaluateSpeaking,
    onError: (error) => {
      console.error('Speaking evaluation mutation error:', error);
    },
  });
};
