import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, Text, View } from 'react-native';

import ChoiceButton from '~/components/molecules/ChoiceButton';
import ReadingContainer from '~/components/molecules/ReadingContainer';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { IAfterLesson, IQuestion } from '~/lib/interfaces';
import { getDuration } from '~/lib/utils';
import { confirmLessonCompletion } from '~/services';

import AnswerModal from '../AnswerModal';
import { BackButton } from '../BackButton';
import { AfterLesson } from '../lesson/AfterLesson';

export default function MultipleChoice({ data, lesson }: { data: IQuestion[]; lesson: number }) {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(0);
  const [carrots, setCarrots] = useState<number>(0);
  const { t } = useTranslation('question');
  const lessonCompletionMutation = useMutation({
    mutationFn: () =>
      confirmLessonCompletion({
        lessonId: lesson,
        correctAnswers,
        wrongAnswers: questions.length - correctAnswers,
        duration: endTime,
      }),
    onSuccess: (response: IAfterLesson) => {
      setXp(response.xp);
      setCarrots(response.carrots);
      setTimeout(() => setIsFinished(true), 200);
    },
    onError: (error) => {
      console.error('Lesson completion mutation error:', error);
    },
  });

  useEffect(() => {
    setQuestions(data);
    setStartTime(new Date());
  }, []);

  const handlePress = (index: number) => {
    if (index === null) return;
    setSelected(index);
  };

  const handleCheckAnswer = () => {
    const answerIndex: number = Array.isArray(questions[currentQuestion].content.answer)
      ? questions[currentQuestion].content.answer[0]
      : questions[currentQuestion].content.answer;
    setIsChecking(true);
    setProgress(((currentQuestion + 1) / questions.length) * 100);
    if (answerIndex === selected) {
      setIsCorrect(true);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIsCorrect(false);
      setAnswer(questions[currentQuestion].content.options[answerIndex]);
    }
  };

  const handleContinue = () => {
    if (currentQuestion === questions.length - 1) {
      setIsChecking(false);
      setIsCorrect(false);
      if (startTime !== null) setEndTime(getDuration(startTime));
      lessonCompletionMutation.mutate();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer(null);
      setSelected(null);
      setIsChecking(false);
      setIsCorrect(false);
    }
  };

  const handleBack = () => {
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
                <ReadingContainer>{questions[currentQuestion]?.content.paragraph || ''}</ReadingContainer>
                <Text className='text-title-4 font-bold'>{questions[currentQuestion]?.content.question}</Text>
              </View>
              <View>
                {questions[currentQuestion]?.content.options?.map((option, index) => (
                  <ChoiceButton
                    key={index}
                    index={index}
                    label={option}
                    selectedBox={selected}
                    isChecking={isChecking}
                    isCorrect={isCorrect}
                    onPress={() => handlePress(index)}
                  />
                ))}
              </View>
            </View>
            <View className={`${Platform.OS === 'android' ? 'pb-10 pt-4' : ''}`}>
              {selected !== null && !isChecking && (
                <Button className='bg-neutral-900' onPress={handleCheckAnswer}>
                  <Text className='text-body font-semibold text-white'>{t('general.check')}</Text>
                </Button>
              )}
            </View>
            {isChecking && isCorrect && <AnswerModal modalType='correct' onPressContinue={handleContinue} />}
            {isChecking && !isCorrect && (
              <AnswerModal modalType='incorrect' correctAnswer={answer} onPressContinue={handleContinue} />
            )}
          </View>
        </ViewComponent>
      )}
    </View>
  );
}
