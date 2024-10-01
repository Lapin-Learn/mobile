import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { SkillEnum } from '~/lib/enums';
import { IAfterLesson, ILessonCompletion } from '~/lib/interfaces';
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

export const useLessonCompletion = (params: ILessonCompletion) => {
  const { lessonId, correctAnswers, wrongAnswers, duration } = params;
  const { setXp, setCarrots, setIsFinished } = useGameStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      confirmLessonCompletion({
        lessonId,
        correctAnswers,
        wrongAnswers,
        duration,
      }),
    onSuccess: (response: IAfterLesson) => {
      setXp(response.xp);
      setCarrots(response.carrots);
      setTimeout(() => setIsFinished(true), 200);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      console.error('Lesson completion mutation error:', error);
    },
  });
};
