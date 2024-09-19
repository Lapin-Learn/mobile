import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import ChoiceButton from '~/components/molecules/ChoiceButton';
import ReadingContainer from '~/components/molecules/ReadingContainer';
import { Button } from '~/components/ui/Button';
import { Progress } from '~/components/ui/Progress';
import { getDuration } from '~/services';

import { BackButton } from '../BackButton';
import CorrectAnswerModal from '../CorrectAnswerModal';
import IncorrectAnswerModal from '../IncorrectAnswerModal';
import { AfterLesson } from '../lesson/AfterLesson';
import { Question } from './types';

const exerciseData: Question[] = [
  {
    id: '1',
    content:
      'In 1898, after her father died, Margaret returned to Adelaide to study and then teach at the Adelaide School of Design. Her early artwork was influenced by the German aesthetic tradition, in which subjects of the natural world were depicted in a true to life manner. In 1898, after her father died, Margaret returned to Adelaide to study and then teach at the Adelaide School of Design. Her early artwork was influenced by the German aesthetic tradition, in which subjects of the natural world were depicted in a true to life manner. In 1898, after her father died, Margaret returned to Adelaide to study and then teach at the Adelaide School of Design. Her early artwork was influenced by the German aesthetic tradition, in which subjects of the natural world were depicted in a true to life manner. In 1898, after her father died, Margaret returned to Adelaide to study and then teach at the Adelaide School of Design. Her early artwork was influenced by the German aesthetic tradition, in which subjects of the natural world were depicted in a true to life manner.',
    questionType: 'multiple_choice',
    question: 'Artists in the German aesthetic tradition portrayed nature realistically.',
    options: ['True', 'False', 'Not Given'],
    answer: 1,
  },
  {
    id: '2',
    content:
      'Stress is one of the serious issues that many people are facing today. It is a feeling of being under too much mental or emotional pressure. Stress is a normal part of life. Everyone feels stress from time to time. However, long-term stress can contribute to health problems. Stress can affect your body, your thoughts, your feelings, and your behavior. Being able to recognize common stress symptoms can help you manage them. Stress that is left unchecked can contribute to many health problems, such as high blood pressure, heart disease, obesity, and diabetes.',
    questionType: 'multiple_choice',
    question: 'Which of the following is NOT a health problem caused by stress?',
    options: ['Lung disease', 'High blood pressure', 'Obesity', 'Diabetes'],
    answer: 0,
  },
  {
    id: '3',
    content:
      'The human brain is the most complex organ in the body. This three-pound mass of gray and white matter sits at the center of all human activity. It controls everything from the way we move to what we think and feel. The brain is made up of many parts that all work together as a team. The brain is protected by the bones of the skull and by a covering of three thin membranes called meninges. The brain is also cushioned and protected by cerebrospinal fluid. This watery fluid is found in the spaces between the arachnoid mater and the pia mater, two of the meninges. The brain is divided into three main parts: the forebrain, the midbrain, and the hindbrain.',
    questionType: 'multiple_choice',
    question: 'Which of the following is NOT true about the brain?',
    options: [
      'It is the most complex organ in the body',
      'It is protected by the bones of the skull',
      'It is cushioned by cerebrospinal fluid',
      'It is divided into four main parts',
    ],
    answer: 3,
  },
];

export default function MultipleChoice(data: any) {
  const [questions, setQuestions] = useState<Question[]>([]);
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
  const { t } = useTranslation('question');

  useEffect(() => {
    setQuestions(exerciseData);
    setStartTime(new Date());
  }, []);

  const handlePress = (index: number) => {
    if (index === null) return;
    setSelected(index);
  };

  const handleCheckAnswer = () => {
    const answerIndex = questions[currentQuestion].answer;
    setIsChecking(true);
    setProgress(((currentQuestion + 1) / questions.length) * 100);
    if (answerIndex === selected) {
      setIsCorrect(true);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIsCorrect(false);
      setAnswer(questions[currentQuestion].options[answerIndex]);
    }
  };

  const handleContinue = () => {
    if (currentQuestion === questions.length - 1) {
      if (startTime !== null) setEndTime(getDuration(startTime));

      setIsFinished(true);
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
                <ReadingContainer>{questions[currentQuestion]?.content}</ReadingContainer>
                <Text className='text-title-4 font-bold'>{questions[currentQuestion]?.question}</Text>
              </View>
              <View>
                {questions[currentQuestion]?.options?.map((option, index) => (
                  <ChoiceButton
                    key={index}
                    label={option}
                    index={index}
                    onPress={() => handlePress(index)}
                    selectedBox={selected}
                    isChecking={isChecking}
                    isCorrect={isCorrect}
                  />
                ))}
              </View>
            </View>
            <View className='pb-10 pt-4'>
              {selected !== null && !isChecking && (
                <Button className='bg-neutral-900' onPress={handleCheckAnswer}>
                  <Text className='text-body font-semibold text-white'>{t('general.check')}</Text>
                </Button>
              )}
            </View>
            {isChecking && isCorrect && <CorrectAnswerModal onPressContinue={handleContinue} />}
            {isChecking && !isCorrect && (
              <IncorrectAnswerModal correctAnswer={answer} onPressContinue={handleContinue} />
            )}
          </View>
        </View>
      )}
    </View>
  );
}
