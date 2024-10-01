import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, Text, View } from 'react-native';

import ReadingContainer from '~/components/molecules/ReadingContainer';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { useLessonCompletion } from '~/hooks/react-query/useDailyLesson';
import { useGameStore } from '~/hooks/zustand';
import { ContentTypeEnum } from '~/lib/enums';
import { IQuestion } from '~/lib/interfaces';

import AnswerModal from '../AnswerModal';
import { BackButton } from '../BackButton';
import { AfterLesson } from '../lesson/AfterLesson';
import { TrackAudio } from '../TrackAudio';
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
    selected,
    isChecking,
    isCorrect,
    correctAnswers,
    progress,
    endTime,
    isFinished,
    xp,
    carrots,
    setContentType,
    setQuestions,
    setStartTime,
    checkAnswer,
    nextQuestion,
    resetGame,
  } = useGameStore();
  const { t } = useTranslation('question');
  const lessonCompletionMutation = useLessonCompletion({
    lessonId: lesson,
    correctAnswers,
    wrongAnswers: questions.length - correctAnswers,
    duration: endTime,
  });

  useEffect(() => {
    setContentType(contentType);
    setQuestions(data);
    setStartTime(new Date());
  }, []);

  // TODO: Handle different content types
  const renderQuestionComponent = () => {
    switch (contentType) {
      case ContentTypeEnum.MULTIPLE_CHOICE:
        return <MultipleChoice />;
      default:
        return <Text>{t('general.unsupportedQuestionType')}</Text>;
    }
  };

  const handleContinue = useCallback(() => {
    nextQuestion();
    if (currentQuestion === questions.length - 1) {
      lessonCompletionMutation.mutate();
    }
  }, [nextQuestion, currentQuestion, questions]);

  const handleBack = () => {
    resetGame();
    router.back();
  };

  const ViewComponent = Platform.OS === 'ios' ? SafeAreaView : View;

  return (
    <View>
      {isFinished ? (
        <AfterLesson
          data={{
            percent: (correctAnswers / questions.length) * 100,
            exp: xp,
            carrot: carrots,
            timer: endTime,
          }}
        />
      ) : (
        <ViewComponent className='flex h-full'>
          <View
            className={`mx-4 flex flex-row items-center justify-center gap-4 px-2 ${Platform.OS === 'android' ? 'mt-8' : ''}`}>
            <BackButton onPress={handleBack} />
            <Progress value={progress} />
          </View>
          <View className='relative flex grow justify-between px-4 pt-4'>
            <View className='gap-8'>
              <View className='gap-3'>
                <Text className='text-title-3 font-bold'>{t('multipleChoice.title')}</Text>
                {questions[currentQuestion]?.audioId && (
                  <TrackAudio data={questions[currentQuestion].audio ?? { id: '', url: '' }} checked={isChecking} />
                )}
                {!questions[currentQuestion]?.audioId && questions[currentQuestion]?.content.paragraph && (
                  <ReadingContainer>{questions[currentQuestion]?.content.paragraph || ''}</ReadingContainer>
                )}
                <Text className='text-title-4 font-bold'>{questions[currentQuestion]?.content.question}</Text>
              </View>
              <View>{renderQuestionComponent()}</View>
            </View>
            <View className='pb-10 pt-4'>
              {selected.length > 0 && !isChecking && (
                <Button className='bg-neutral-900' onPress={checkAnswer}>
                  <Text className='text-button'>{t('general.check')}</Text>
                </Button>
              )}
            </View>
            {isChecking && isCorrect && <AnswerModal modalType='correct' onPressContinue={handleContinue} />}
            {isChecking && !isCorrect && (
              <AnswerModal modalType='incorrect' correctAnswers={answer} onPressContinue={handleContinue} />
            )}
          </View>
        </ViewComponent>
      )}
    </View>
  );
}
