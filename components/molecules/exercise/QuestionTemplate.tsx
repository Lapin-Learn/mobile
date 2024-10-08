import { router } from 'expo-router';
import { LucideMoveLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Progress } from '~/components/ui/Progress';
import { useLessonCompletion } from '~/hooks/react-query/useDailyLesson';
import useLesson from '~/hooks/useLesson';

import AnswerModal from '../AnswerModal';
import { Loading } from '../Loading';
import PlatformView from '../PlatformView';
import AnswerInput from './AnswerInput';
import QuestionCard from './QuestionCard';

export default function QuestionTemplate({ lessonId }: { lessonId: string }) {
  const { t } = useTranslation('question');
  const {
    isLoading,
    isError,
    isSuccess,
    nextQuestion,
    answerQuestion,
    totalQuestion,
    learnerAnswers,
    isCompleted,
    clear,
    currentQuestion,
    currentQuestionIndex,
  } = useLesson(lessonId);
  const lessonCompletionMutation = useLessonCompletion();
  const { isPending } = lessonCompletionMutation;

  const [startTime, setStartTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // const handleContinue = useCallback(() => {
  //   nextQuestion();
  //   if (currentQuestion === questions.length - 1) {
  //     const endTime = getDuration(startTime);
  //     lessonCompletionMutation.mutate({
  //       lessonId: lesson,
  //       correctAnswers,
  //       wrongAnswers: questions.length - correctAnswers,
  //       duration: endTime,
  //     });
  //     setDuration(endTime);
  //   }
  // }, [nextQuestion, currentQuestion, questions]);

  const handleBack = () => {
    clear();
    router.back();
  };

  if (isPending) {
    return (
      <View className='h-full'>
        <Loading />
      </View>
    );
  }

  return (
    <View>
      {isCompleted ? (
        // <AfterLesson
        //   data={{
        //     percent: (correctAnswers / questions.length) * 100,
        //     exp: xp,
        //     carrot: carrots,
        //     timer: duration,
        //   }}
        // />
        <Text>Complete</Text>
      ) : (
        <PlatformView className='flex'>
          <View className='mx-4 flex flex-row items-center justify-center gap-x-4 px-2'>
            <Pressable className='w-6' onPress={handleBack}>
              <LucideMoveLeft color={'black'} />
            </Pressable>
            <Progress value={((currentQuestionIndex + 1) / totalQuestion) * 100} />
          </View>
          {currentQuestion && (
            <View className='relative h-full px-4'>
              <QuestionCard
                data={currentQuestion}
                isPaused={typeof learnerAnswers[currentQuestionIndex] == 'boolean'}
              />
              <AnswerInput
                onAnswer={answerQuestion}
                result={learnerAnswers[currentQuestionIndex]}
                {...currentQuestion}
              />
            </View>
          )}
          {typeof learnerAnswers[currentQuestionIndex] === 'boolean' && (
            <AnswerModal
              type={learnerAnswers[currentQuestionIndex] ? 'correct' : 'incorrect'}
              // TODO: Fix correctAnswers, map from currentQuestion?.content.answer from number[] to string[]
              // correctAnswers={currentQuestion?.content.answer ?? []}
              onPressContinue={nextQuestion}
            />
          )}
        </PlatformView>
      )}
    </View>
  );
}
