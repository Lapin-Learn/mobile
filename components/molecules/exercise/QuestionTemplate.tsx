import { router } from 'expo-router';
import { LucideMoveLeft } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';

import { Progress } from '~/components/ui/Progress';
import useLesson from '~/hooks/useLesson';

import AnswerModal from '../AnswerModal';
import { AfterLesson } from '../lesson/AfterLesson';
import { Loading } from '../Loading';
import PlatformView from '../PlatformView';
import AnswerInput from './answer-input/AnswerInput';
import QuestionCard from './QuestionCard';

export default function QuestionTemplate({ lessonId }: { lessonId: string }) {
  const {
    nextQuestion,
    answerQuestion,
    totalQuestion,
    learnerAnswers,
    isCompleted,
    clear,
    currentQuestion,
    currentQuestionIndex,
    mutation,
    result,
    isPendingMutation,
  } = useLesson(lessonId);

  useEffect(() => {
    if (isCompleted && currentQuestionIndex === totalQuestion - 1) {
      mutation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted]);

  const handleBack = () => {
    clear();
    router.back();
  };

  if (isPendingMutation) {
    return (
      <View className='h-full'>
        <Loading />
      </View>
    );
  }

  return (
    <View>
      {isCompleted && result ? (
        <AfterLesson data={result} />
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
