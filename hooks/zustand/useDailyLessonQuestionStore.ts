import { create } from 'zustand';

import { LessonResultProps } from '~/components/organisms/lesson/LessonResult';
import { useLessonCompletion } from '~/hooks/react-query/useDailyLesson';
import { IQuestion } from '~/lib/types/questions';
import { getDuration } from '~/lib/utils';
export type SpeakingAnswer = {
  correct_letters?: string;
};
export type Answer = {
  numberOfCorrect: number;
  totalOfQuestions: number;
} & SpeakingAnswer;

type State = {
  lessonId: string;
  questions: IQuestion[];
  totalQuestion: number;
  currentQuestionIndex: number;
  currentQuestion: IQuestion | null;
  learnerAnswers: Answer[];
  isCompleted: boolean;
  learnerAnswer: number[] | null;
  startTime: number;
  result: LessonResultProps | null;
};

type Action = {
  setQuestions: (questions: State['questions'], lessonId: State['lessonId']) => void;
  setResult: (result: State['result']) => void;
  answerQuestion: (newAnswer: Answer) => void;
  nextQuestion: () => void;
  clear: () => void;
};

const initialValue: State = {
  lessonId: '',
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
  setQuestions: (questions, lessonId) => {
    set({
      lessonId,
      questions,
      totalQuestion: questions.length,
      currentQuestion: questions.length ? questions[0] : null,
      learnerAnswers: Array<Answer>(questions.length).fill({
        numberOfCorrect: 0,
        totalOfQuestions: 0,
        correct_letters: undefined,
      }),
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

export const useDailyLessonQuestionStore = (isJumpBand: boolean = false) => {
  const lessonCompletionMutation = useLessonCompletion();
  // const lessonSpeakingCompletionMutation = useLessonSpeakingCompletion();
  const {
    lessonId,
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
    // check ì the learnerAnswer contain url or not
    if (learnerAnswers.some((answer) => answer.correct_letters)) {
      return;
    }
    const statistic = learnerAnswers.reduce(
      (acc, answer) => {
        if (answer.correct_letters) {
          const accCorrectLetters = answer.correct_letters.split('').filter((letter) => letter === '1').length;
          return {
            numberOfCorrect: acc.numberOfCorrect + accCorrectLetters,
            totalOfQuestions: acc.totalOfQuestions + 1,
          };
        }
        const accCorrect = acc.numberOfCorrect + answer.numberOfCorrect;
        const accTotal = acc.totalOfQuestions + answer.totalOfQuestions;

        return { numberOfCorrect: accCorrect, totalOfQuestions: accTotal };
      },
      { numberOfCorrect: 0, totalOfQuestions: 0 }
    );

    return lessonCompletionMutation.mutate(
      {
        lessonId: Number(lessonId),
        correctAnswers: statistic.numberOfCorrect,
        wrongAnswers: statistic.totalOfQuestions - statistic.numberOfCorrect,
        duration: getDuration(startTime),
        isJumpBand,
      },
      {
        onSuccess: ({ bonusCarrot, bonusXP, correctAnswers, duration }) => {
          setResult({
            carrot: bonusCarrot,
            exp: bonusXP,
            percent: Math.ceil((correctAnswers / statistic.totalOfQuestions) * 100),
            timer: duration,
          });
        },
      }
    );
  };

  const isPendingMutation = lessonCompletionMutation.isPending;

  return {
    state: {
      totalQuestion,
      learnerAnswers,
      currentQuestion,
      currentQuestionIndex,
      startTime,
      result,
      isCompleted,
      isPendingMutation,
    },
    setQuestions,
    nextQuestion,
    answerQuestion,
    clear,
    mutation,
  };
};

export type UseLessonReturnType = ReturnType<typeof useLessonStore>;
