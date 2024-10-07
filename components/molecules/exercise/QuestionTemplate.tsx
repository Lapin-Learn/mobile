import { router } from 'expo-router';
import { LucideMoveLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import useLesson from '~/components/organisms/exercise-question/useLesson';
import { Progress } from '~/components/ui/Progress';
import { useLessonCompletion } from '~/hooks/react-query/useDailyLesson';

import AnswerModal from '../AnswerModal';
import { Loading } from '../Loading';
import PlatformView from '../PlatformView';
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

  // TODO: Handle different content types
  // const renderQuestionComponent = () => {
  //   if (!questions.length || !contentType) {
  //     return null;
  //   }

  //   switch (contentType) {
  //     case ContentTypeEnum.MULTIPLE_CHOICE:
  //       return <MultipleChoice />;

  //     case ContentTypeEnum.MATCHING:
  //       return <Matching />;

  //     default:
  //       return <Text>{t('general.unsupportedQuestionType')}</Text>;
  //   }
  // };

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

  // const handleCheckAnswer = () => {
  //   checkAnswer(selected);
  // };

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
          <View className='flex justify-between px-4 pt-4'>
            <View className='relative gap-8'>
              {currentQuestion && (
                <QuestionCard
                  data={currentQuestion}
                  isPaused={typeof learnerAnswers[currentQuestionIndex] == 'boolean'}
                />
              )}
              {/* <View className='grow'>{renderQuestionComponent()}</View> */}
            </View>
          </View>
          {/* {selected.length > 0 && !isChecking && (
            <View className='absolute bottom-0 left-0 right-0 bg-background p-4 pb-10'>
              <Button className='bg-neutral-900' onPress={handleCheckAnswer}>
                <Text className='text-button'>{t('general.check')}</Text>
              </Button>
            </View>
          )} */}
          {typeof learnerAnswers[currentQuestionIndex] === 'boolean' && (
            <AnswerModal modalType='correct' onPressContinue={nextQuestion} />
          )}
        </PlatformView>
      )}
    </View>
  );
}
