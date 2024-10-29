import { LucideMoveLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, View } from 'react-native';

import { ExitModal } from '~/components/molecules/ExitModal';
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
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isCompleted && currentQuestionIndex === totalQuestion - 1) {
      mutation();
    }
  }, [isCompleted]);

  useEffect(() => {
    const backAction = () => {
      setIsExiting(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleBack = () => {
    setIsExiting(true);
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
        <View className='relative flex h-full flex-col px-4'>
          <QuestionCard data={currentQuestion} isPaused={typeof learnerAnswers[currentQuestionIndex] == 'boolean'} />
          <View className='flex-1'>
            <AnswerInput onAnswer={answerQuestion} result={learnerAnswers[currentQuestionIndex]} {...currentQuestion} />
          </View>
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
      {isExiting && <ExitModal onClose={() => setIsExiting(false)} />}
    </PlatformView>
  );
};

export default QuestionTemplate;
