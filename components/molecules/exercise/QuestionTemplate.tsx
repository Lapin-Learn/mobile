import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ReadingContainer from '~/components/molecules/ReadingContainer';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { useLessonCompletion } from '~/hooks/react-query/useDailyLesson';
import { useGameStore } from '~/hooks/zustand';
import { ContentTypeEnum } from '~/lib/enums';
import { IQuestion } from '~/lib/interfaces';
import { getDuration } from '~/lib/utils';

import AnswerModal from '../AnswerModal';
import { BackButton } from '../BackButton';
import ContentText from '../ContentText';
import { AfterLesson } from '../lesson/AfterLesson';
import { Loading } from '../Loading';
import PlatformView from '../PlatformView';
import { TrackAudio } from '../TrackAudio';
import { Matching } from './matching/Matching';
import MultipleChoice from './MultipleChoice';

export default function QuestionTemplate({
  contentType,
  data,
  lesson,
}: {
  contentType: ContentTypeEnum;
  data: IQuestion[];
  lesson: number;
}) {
  const {
    questions,
    currentQuestion,
    answer,
    isChecking,
    isCorrect,
    correctAnswers,
    progress,
    xp,
    carrots,
    selected,
    checkAnswer,
    setContentType,
    setQuestions,
    resetGame,
    setIsChecking,
    setIsCorrect,
    setCurrentQuestion,
    setAnswer,
    setSelected,
  } = useGameStore();
  const { t } = useTranslation('question');
  const lessonCompletionMutation = useLessonCompletion();
  const { isPending, isSuccess } = lessonCompletionMutation;

  const [startTime, setStartTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    setQuestions(data);
    setContentType(contentType);
    setQuestions(data);
    setStartTime(new Date().getTime());
  }, []);

  // TODO: Handle different content types
  const renderQuestionComponent = () => {
    if (!questions.length || !contentType) {
      return null;
    }

    switch (contentType) {
      case ContentTypeEnum.MULTIPLE_CHOICE:
        return <MultipleChoice />;

      case ContentTypeEnum.MATCHING:
        return <Matching />;

      default:
        return <Text>{t('general.unsupportedQuestionType')}</Text>;
    }
  };

  const nextQuestion = () => {
    setIsChecking(false);
    setIsCorrect(false);
    setAnswer([]);
    if (currentQuestion !== questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      switch (contentType) {
        case ContentTypeEnum.MULTIPLE_CHOICE: {
          setSelected([]);
        }
        case ContentTypeEnum.MATCHING: {
          break;
        }
      }
    }
  };

  const handleContinue = useCallback(() => {
    nextQuestion();
    if (currentQuestion === questions.length - 1) {
      const endTime = getDuration(startTime);
      lessonCompletionMutation.mutate({
        lessonId: lesson,
        correctAnswers,
        wrongAnswers: questions.length - correctAnswers,
        duration: endTime,
      });
      setDuration(endTime);
    }
  }, [nextQuestion, currentQuestion, questions]);

  const handleCheckAnswer = () => {
    checkAnswer(selected);
  };

  const handleBack = () => {
    resetGame();
    router.back();
  };

  const ViewComponent = Platform.OS === 'ios' ? SafeAreaView : View;

  if (isPending) {
    return (
      <View className='h-full'>
        <Loading />
      </View>
    );
  }

  return (
    <View>
      {!isPending && isSuccess ? (
        <AfterLesson
          data={{
            percent: (correctAnswers / questions.length) * 100,
            exp: xp,
            carrot: carrots,
            timer: duration,
          }}
        />
      ) : (
        <PlatformView className='flex'>
          <View className='mx-4 flex flex-row items-center justify-center gap-x-4 px-2'>
            <BackButton onPress={handleBack} />
            <Progress value={progress} />
          </View>
          <View className='flex justify-between px-4 pt-4'>
            <View className='relative gap-8'>
              <View className='gap-3'>
                <Text className='text-title-3 font-bold'>{t('multipleChoice.title')}</Text>
                {questions[currentQuestion]?.audioId && (
                  <TrackAudio data={questions[currentQuestion].audio ?? { id: '', url: '' }} checked={isChecking} />
                )}
                {!questions[currentQuestion]?.audioId && questions[currentQuestion]?.content.paragraph && (
                  <ReadingContainer>
                    <ContentText>{questions[currentQuestion]?.content.paragraph}</ContentText>
                  </ReadingContainer>
                )}
                {contentType === ContentTypeEnum.MULTIPLE_CHOICE && (
                  <Text className='text-title-4 font-bold'>{questions[currentQuestion]?.content.question}</Text>
                )}
              </View>
              <View className='grow'>{renderQuestionComponent()}</View>
            </View>
          </View>
          {selected.length > 0 && !isChecking && (
            <View className='absolute bottom-0 left-0 right-0 bg-background p-4 pb-10'>
              <Button className='bg-neutral-900' onPress={handleCheckAnswer}>
                <Text className='text-button'>{t('general.check')}</Text>
              </Button>
            </View>
          )}
          {isChecking &&
            (isCorrect ? (
              <AnswerModal modalType='correct' onPressContinue={handleContinue} />
            ) : (
              <AnswerModal modalType='incorrect' correctAnswers={answer} onPressContinue={handleContinue} />
            ))}
        </PlatformView>
      )}
    </View>
  );
}
