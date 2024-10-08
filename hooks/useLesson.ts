import { useEffect } from 'react';
import { create } from 'zustand';

import { AfterLessonProps } from '~/components/molecules/lesson/AfterLesson';
import { useLessonCompletion, useLessonQuestions } from '~/hooks/react-query/useDailyLesson';
import { TypeQuestion } from '~/lib/types/questions';
import { getDuration } from '~/lib/utils';

export type Answer = boolean | 'notAnswered';

type State = {
  questions: TypeQuestion[];
  totalQuestion: number;
  currentQuestionIndex: number;
  currentQuestion: TypeQuestion | null;
  learnerAnswers: Answer[];
  isCompleted: boolean;
  learnerAnswer: number[] | null;
  startTime: number;
  result: AfterLessonProps | null;
};

type Action = {
  setQuestions: (questions: State['questions']) => void;
  setResult: (result: State['result']) => void;
  answerQuestion: (newAnswer: boolean) => void;
  nextQuestion: () => void;
  clear: () => void;
};

const initialValue: State = {
  questions: [],
  totalQuestion: 0,
  currentQuestionIndex: 0,
  currentQuestion: null,
  learnerAnswers: [],
  isCompleted: false,
  learnerAnswer: null,
  startTime: 0,
  result: null,
};
const useLessonStore = create<State & Action>((set, get) => ({
  ...initialValue,
  setQuestions: (questions: State['questions']) => {
    set({
      questions,
      totalQuestion: questions.length,
      currentQuestion: questions.length ? questions[0] : null,
      learnerAnswers: Array(questions.length).fill('notAnswered'),
      startTime: Date.now(),
    });
  },
  setResult: (result: State['result']) => {
    set({ result });
  },
  answerQuestion: (newAnswer) => {
    const { learnerAnswers, currentQuestionIndex } = get();
    learnerAnswers[currentQuestionIndex] = newAnswer;
    set({ learnerAnswers });
  },
  nextQuestion: () => {
    const { questions, currentQuestionIndex, totalQuestion, isCompleted } = get();
    if (currentQuestionIndex < totalQuestion - 1) {
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        currentQuestion: questions[currentQuestionIndex + 1],
      });
    } else {
      if (!isCompleted) {
        set({ isCompleted: true });
      }
    }
  },
  clear: () => {
    set(initialValue);
  },
}));

export default function useLesson(lessonId: string) {
  const lessonCompletetionMutation = useLessonCompletion();
  const { data: lesson, isLoading, isError, isSuccess } = useLessonQuestions({ lessonId });
  const {
    setQuestions,
    nextQuestion,
    totalQuestion,
    currentQuestion,
    learnerAnswers,
    answerQuestion,
    currentQuestionIndex,
    clear,
    isCompleted,
    startTime,
    result,
    setResult,
  } = useLessonStore();

  const mutation = () => {
    const correctAnswers = learnerAnswers.reduce((acc, answer) => {
      if (answer === true) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return lessonCompletetionMutation.mutate(
      {
        lessonId: Number(lessonId),
        correctAnswers,
        wrongAnswers: totalQuestion - correctAnswers,
        duration: getDuration(startTime),
      },
      {
        onSuccess: ({ bonusCarrot, bonusXP, correctAnswers, duration }) => {
          setResult({
            carrot: bonusCarrot,
            exp: bonusXP,
            percent: Math.ceil((correctAnswers / totalQuestion) * 100),
            timer: duration,
          });
        },
      }
    );
  };

  const isPendingMutation = lessonCompletetionMutation.isPending;

  useEffect(() => {
    if (isSuccess && lesson) {
      setQuestions(lesson.questionToLessons.map((q) => q.question));
    }
  }, [isSuccess, lesson]);

  return {
    isLoading,
    isError,
    isSuccess,
    isCompleted,
    nextQuestion,
    answerQuestion,
    totalQuestion,
    learnerAnswers,
    clear,
    currentQuestion,
    currentQuestionIndex,
    startTime,
    mutation,
    result,
    isPendingMutation,
  };
}

export type UseLessonReturnType = ReturnType<typeof useLessonStore>;
