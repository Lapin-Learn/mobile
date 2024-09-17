import { time } from 'console';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { set } from 'react-hook-form';
import { Text, View } from 'react-native';
import { start } from 'repl';

import ChoiceButton from '~/components/molecules/ChoiceButton';
import ReadingContainer from '~/components/molecules/ReadingContainer';
import { Button } from '~/components/ui/Button';

import { BackButton } from '../BackButton';
import CorrectAnswerModal from '../CorrectAnswerModal';
import IncorrectAnswerModal from '../IncorrectAnswerModal';
import ProgressBar from '../ProgressBar';
import { Question } from './type';

const exerciseData: Question[] = [
  {
    id: '1',
    content:
      'In 1898, after her father died, Margaret returned to Adelaide to study and then teach at the Adelaide School of Design. Her early artwork was influenced by the German aesthetic tradition, in which subjects of the natural world were depicted in a true to life manner. In 1898, after her father died, Margaret returned to Adelaide to study and then teach at the Adelaide School of Design. Her early artwork was influenced by the German aesthetic tradition, in which subjects of the natural world were depicted in a true to life manner. In 1898, after her father died, Margaret returned to Adelaide to study and then teach at the Adelaide School of Design. Her early artwork was influenced by the German aesthetic tradition, in which subjects of the natural world were depicted in a true to life manner. In 1898, after her father died, Margaret returned to Adelaide to study and then teach at the Adelaide School of Design. Her early artwork was influenced by the German aesthetic tradition, in which subjects of the natural world were depicted in a true to life manner.',
    questionType: 'multipleChoice',
    question: 'Artists in the German aesthetic tradition portrayed nature realistically.',
    choices: ['True', 'False', 'Not Given'],
    answer: 1,
  },
  {
    id: '2',
    content:
      'Stress is one of the serious issues that many people are facing today. It is a feeling of being under too much mental or emotional pressure. Stress is a normal part of life. Everyone feels stress from time to time. However, long-term stress can contribute to health problems. Stress can affect your body, your thoughts, your feelings, and your behavior. Being able to recognize common stress symptoms can help you manage them. Stress that is left unchecked can contribute to many health problems, such as high blood pressure, heart disease, obesity, and diabetes.',
    questionType: 'multipleChoice',
    question: 'Which of the following is NOT a health problem caused by stress?',
    choices: ['Lung disease', 'High blood pressure', 'Obesity', 'Diabetes'],
    answer: 0,
  },
  {
    id: '3',
    content:
      'The human brain is the most complex organ in the body. This three-pound mass of gray and white matter sits at the center of all human activity. It controls everything from the way we move to what we think and feel. The brain is made up of many parts that all work together as a team. The brain is protected by the bones of the skull and by a covering of three thin membranes called meninges. The brain is also cushioned and protected by cerebrospinal fluid. This watery fluid is found in the spaces between the arachnoid mater and the pia mater, two of the meninges. The brain is divided into three main parts: the forebrain, the midbrain, and the hindbrain.',
    questionType: 'multipleChoice',
    question: 'Which of the following is NOT true about the brain?',
    choices: [
      'It is the most complex organ in the body',
      'It is protected by the bones of the skull',
      'It is cushioned by cerebrospinal fluid',
      'It is divided into four main parts',
    ],
    answer: 3,
  },
];

export default function MultipleChoice() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

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
    if (answerIndex === selected) {
      setIsCorrect(true);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIsCorrect(false);
      setAnswer(questions[currentQuestion].choices[answerIndex]);
    }
  };

  const handleContinue = () => {
    if (currentQuestion === questions.length - 1) {
      const endTime = new Date();
      if (startTime !== null) {
        alert(`Correct answers: ${correctAnswers} - Time: ${Math.abs(endTime.getTime() - startTime.getTime()) / 1000}`);
        router.push({
          pathname: '/(map)',
          params: {
            correctAnswers,
            totalQuestions: questions.length,
            time: Math.abs(endTime.getTime() - startTime.getTime()) / 1000,
          },
        });
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer(null);
      setSelected(null);
      setIsChecking(false);
      setIsCorrect(false);
    }
  };

  const handleBack = () => {
    router.push('/(map)');
  };

  return (
    <View className='flex h-full'>
      <View className='mx-4 mt-8 flex flex-row items-center justify-center gap-4 px-2'>
        <BackButton onPress={handleBack} />
        <ProgressBar total={questions?.length} current={currentQuestion} />
      </View>
      <View className='relative flex grow justify-between px-4 pt-4'>
        <View className='gap-8'>
          <View className='gap-3'>
            <Text className='text-title-3 font-bold'>Đọc đoạn văn và chọn câu trả lời</Text>
            <ReadingContainer>{questions[currentQuestion]?.content}</ReadingContainer>
            <Text className='text-title-4 font-bold'>{questions[currentQuestion]?.question}</Text>
          </View>
          <View>
            {questions[currentQuestion]?.choices?.map((choice, index) => (
              <ChoiceButton
                key={index}
                label={choice}
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
            <Button className='rounded-lg bg-neutral-900' onPress={handleCheckAnswer}>
              <Text className='text-body font-semibold text-white'>Kiểm tra</Text>
            </Button>
          )}
        </View>
        {isChecking && isCorrect && <CorrectAnswerModal onPressContinue={handleContinue} />}
        {isChecking && !isCorrect && <IncorrectAnswerModal correctAnswer={answer} onPressContinue={handleContinue} />}
      </View>
    </View>
  );
}
