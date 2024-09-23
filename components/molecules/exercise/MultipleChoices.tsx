import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import ReadingContainer from '~/components/molecules/ReadingContainer';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { IQuestion } from '~/lib/interfaces';
import { getDuration } from '~/lib/utils';

import AnswerModal from '../AnswerModal';
import { BackButton } from '../BackButton';
import { ChoiceCheckBox } from '../ChoiceCheckBox';
import { AfterLesson } from '../lesson/AfterLesson';

export default function MultipleChoices({ data, lesson }: { data: IQuestion[]; lesson: number }) {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answer, setAnswer] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [checkedBox, setCheckedBox] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const { t } = useTranslation('question');

  useEffect(() => {
    setQuestions(data);
    setStartTime(new Date());
  }, []);

  const handlePress = (index: number) => {
    if (index === null) return;
    setSelected((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter((answer) => answer !== index);
      } else {
        return [...prevSelected, index];
      }
    });
  };

  const handleCheckAnswer = () => {
    const answerIndices: number[] = Array.isArray(questions[currentQuestion].content.answer)
      ? questions[currentQuestion].content.answer
      : [questions[currentQuestion].content.answer];
    setIsChecking(true);
    setProgress(((currentQuestion + 1) / questions.length) * 100);
    if (selected.length === answerIndices.length && selected.every((answer) => answerIndices.includes(answer))) {
      setIsCorrect(true);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIsCorrect(false);
      setAnswer(answerIndices.map((index: any) => questions[currentQuestion].content.options[index]));
    }
  };

  const handleContinue = () => {
    if (currentQuestion === questions.length - 1) {
      if (startTime !== null) setEndTime(getDuration(startTime));
      setIsFinished(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer([]);
      setSelected([]);
      setIsChecking(false);
      setIsCorrect(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View>
      {isFinished ? (
        <AfterLesson
          data={{
            percent: (correctAnswers / questions.length) * 100,
            exp: 20,
            carrot: 20,
            timer: endTime,
          }}
          lessonCompletion={{
            lessonId: lesson,
            correctAnswers,
            wrongAnswers: questions.length - correctAnswers,
            duration: endTime,
          }}
        />
      ) : (
        <View className='flex h-full'>
          <View className='mx-4 mt-8 flex flex-row items-center justify-center gap-4 px-2'>
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
                  <ChoiceCheckBox
                    key={index}
                    index={index}
                    label={option}
                    selectedBox={selected}
                    isChecking={isChecking}
                    isCorrect={isCorrect}
                    checked={checkedBox}
                    onPress={() => handlePress(index)}
                    onCheckedChange={() => setCheckedBox(selected.includes(index))}
                  />
                ))}
              </View>
            </View>
            <View className='pb-10 pt-4'>
              {selected.length > 0 && !isChecking && (
                <Button className='bg-neutral-900' onPress={handleCheckAnswer}>
                  <Text className='text-body font-semibold text-white'>{t('general.check')}</Text>
                </Button>
              )}
            </View>
            {isChecking && isCorrect && <AnswerModal modalType='correct' onPressContinue={handleContinue} />}
            {isChecking && !isCorrect && (
              <AnswerModal modalType='incorrect' correctAnswers={answer} onPressContinue={handleContinue} />
            )}
          </View>
        </View>
      )}
    </View>
  );
}
