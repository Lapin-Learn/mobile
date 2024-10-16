import { router } from 'expo-router';
import { LucideMoveLeft } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Loading } from '~/components/molecules/Loading';
import { Progress } from '~/components/ui/Progress';
import { useDailyLessonQuestionStore } from '~/hooks/zustand';

import PlatformView from '../../templates/PlatformView';
import AnswerInput from './answer-input/AnswerInput';
import AnswerModal from './AnswerModal';
import QuestionCard from './QuestionCard';

const QuestionTemplate = () => {
  const {
    nextQuestion,
    answerQuestion,
    mutation,
    state: { totalQuestion, learnerAnswers, isCompleted, currentQuestion, currentQuestionIndex, isPendingMutation },
  } = useDailyLessonQuestionStore();

  useEffect(() => {
    if (isCompleted && currentQuestionIndex === totalQuestion - 1) {
      mutation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted]);

  const handleBack = () => {
    router.back();
  };

  if (isPendingMutation) {
    return <Loading />;
  }

  return (
    <PlatformView className='flex'>
      <View className='mx-4 flex flex-row items-center justify-center gap-x-4 px-2'>
        <Pressable className='w-6' onPress={handleBack}>
          <LucideMoveLeft color='black' />
        </Pressable>
        <Progress value={((currentQuestionIndex + 1) / totalQuestion) * 100} />
      </View>
      {currentQuestion && (
        <View className='relative h-full px-4'>
          <QuestionCard data={currentQuestion} isPaused={typeof learnerAnswers[currentQuestionIndex] == 'boolean'} />
          <ScrollView>
            <View className='pb-10'>
              <AnswerInput
                onAnswer={answerQuestion}
                result={learnerAnswers[currentQuestionIndex]}
                {...currentQuestion}
              />
            </View>
          </ScrollView>
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
  );
};

export default QuestionTemplate;
