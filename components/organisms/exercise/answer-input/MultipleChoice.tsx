import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import ChoiceButton from '~/components/molecules/exercise/ChoiceButton';
import { ChoiceCheckBox } from '~/components/molecules/exercise/ChoiceCheckBox';
import { Button } from '~/components/ui/Button';
import { RadioGroup } from '~/components/ui/RadioGroup';
import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
import { GLOBAL_STYLES } from '~/lib/constants';
import { MultipleChoiceContent } from '~/lib/types/questions';

type MultipleChoiceProps = MultipleChoiceContent & {
  onAnswer: (answer: Answer) => void;
  result: Answer;
};

const MultipleChoice = ({ options, answer, onAnswer, result }: MultipleChoiceProps) => {
  const { t } = useTranslation('question');
  const [selected, setSelected] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const isNotAnswered = result.numberOfCorrect === 0 && result.totalOfQuestions === 0;

  const answerQuestion = () => {
    const isCorrect = selected.every((index) => answer.includes(index));
    onAnswer({
      numberOfCorrect: isCorrect ? 1 : 0,
      totalOfQuestions: 1,
    });
  };

  useEffect(() => {
    if (isNotAnswered) {
      setSelected([]);
    }
  }, [result]);

  useEffect(() => {
    if ((answer.length === 1 && selected.length > 0) || selected.length > 1) {
      setIsChecking(true);
    } else {
      setIsChecking(false);
    }
  }, [selected, answer]);

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
      <ScrollView style={[{ flex: 1 }, isChecking ? { marginBottom: 88 } : { marginBottom: 40 }]}>
        {answer.length === 1 ? (
          <RadioGroup
            value={options[selected[0]]}
            onValueChange={(value) => setSelected([options.findIndex((option) => option === value)])}>
            {options.map((option, index) => (
              <ChoiceButton
                key={index}
                label={option}
                onLabelPress={() => handlePress(index)}
                variant={
                  isNotAnswered
                    ? undefined
                    : answer.includes(index)
                      ? 'correct'
                      : selected.includes(index)
                        ? 'incorrect'
                        : undefined
                }
              />
            ))}
          </RadioGroup>
        ) : (
          options.map((option, index) => (
            <ChoiceCheckBox
              key={index}
              label={option}
              onPress={() => handlePress(index)}
              variant={
                isNotAnswered
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
          ))
        )}
      </ScrollView>
      {isChecking && (
        <View style={GLOBAL_STYLES.checkButtonView}>
          <Button variant='black' size='lg' onPress={answerQuestion}>
            <Text style={GLOBAL_STYLES.textButton}>{t('general.check')}</Text>
          </Button>
        </View>
      )}
    </>
  );
};

export default MultipleChoice;
