import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import ChoiceButton from '~/components/molecules/exercise/ChoiceButton';
import { ChoiceCheckBox } from '~/components/molecules/exercise/ChoiceCheckBox';
import { Button } from '~/components/ui/Button';
import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
import { MultipleChoiceContent } from '~/lib/types/questions';

type MultipleChoiceProps = MultipleChoiceContent & {
  onAnswer: (isCorrect: boolean) => void;
  result: Answer;
};

const MultipleChoice = ({ options, answer, onAnswer, result }: MultipleChoiceProps) => {
  const { t } = useTranslation('question');
  const [selected, setSelected] = useState<number[]>([]);

  const answerQuestion = () => {
    const isCorrect = selected.every((index) => answer.includes(index));
    onAnswer(isCorrect);
  };

  useEffect(() => {
    if (result === 'notAnswered') setSelected([]);
  }, [result]);

  const handlePress = (index: number) => {
    setSelected((prev) => {
      if (answer.length === 1) {
        if (prev.includes(index)) {
          return [];
        } else {
          return [index];
        }
      }
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <>
      <ScrollView>
        {answer.length === 1
          ? options.map((option, index) => (
              <ChoiceButton
                key={index}
                label={option}
                onPress={() => handlePress(index)}
                variant={
                  result === 'notAnswered'
                    ? selected.includes(index)
                      ? 'selected'
                      : 'default'
                    : answer.includes(index)
                      ? 'correct'
                      : selected.includes(index)
                        ? 'incorrect'
                        : 'default'
                }
              />
            ))
          : options.map((option, index) => (
              <ChoiceCheckBox
                key={index}
                label={option}
                onPress={() => handlePress(index)}
                variant={
                  result === 'notAnswered'
                    ? selected.includes(index)
                      ? 'selected'
                      : 'default'
                    : answer.includes(index)
                      ? 'correct'
                      : selected.includes(index)
                        ? 'incorrect'
                        : 'default'
                }
                checked={selected.includes(index)}
                onCheckedChange={() => {}}
              />
            ))}
      </ScrollView>
      {((answer.length === 1 && selected.length > 0) || selected.length > 1) && (
        <View className='absolute bottom-0 left-0 right-0 pb-10'>
          <Button className='bg-neutral-900' onPress={answerQuestion}>
            <Text className='text-button'>{t('general.check')}</Text>
          </Button>
        </View>
      )}
    </>
  );
};

export default MultipleChoice;
