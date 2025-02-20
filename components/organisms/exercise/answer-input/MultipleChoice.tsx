import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import ChoiceButton from '~/components/molecules/exercise/ChoiceButton';
import { ChoiceCheckBox } from '~/components/molecules/exercise/ChoiceCheckBox';
import ChoiceRadio from '~/components/molecules/exercise/ChoiceRadio';
import { Button } from '~/components/ui/Button';
import { RadioGroup } from '~/components/ui/RadioGroup';
import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
import { GLOBAL_STYLES } from '~/lib/constants';
import { MultipleChoiceContent } from '~/lib/types/questions';
import { getMultipleChoiceDecoration } from '~/lib/utils/question-decoration';

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

  const decoration = getMultipleChoiceDecoration(options, answer.length);

  const getVariant = (index: number) => {
    if (isNotAnswered) {
      return selected.includes(index) ? 'selected' : 'default';
    }
    if (answer.includes(index)) {
      return 'correct';
    }
    if (selected.includes(index)) {
      return 'incorrect';
    }
    return 'default';
  };

  return (
    <>
      <ScrollView style={[{ flex: 1 }, isChecking ? { marginBottom: 88 } : { marginBottom: 40 }]}>
        {decoration.choice === 'radio' ? (
          <RadioGroup
            value={options[selected[0]]}
            style={{ gap: 0 }}
            onValueChange={(value) => setSelected([options.findIndex((option) => option === value)])}>
            {options.map((option, index) => (
              <ChoiceRadio
                key={index}
                label={option}
                onLabelPress={() => handlePress(index)}
                variant={getVariant(index)}
              />
            ))}
          </RadioGroup>
        ) : decoration.choice === 'button' ? (
          options.map((option, index) => (
            <ChoiceButton
              key={index}
              label={option}
              onLabelPress={() => handlePress(index)}
              variant={getVariant(index)}
            />
          ))
        ) : (
          options.map((option, index) => (
            <ChoiceCheckBox
              key={index}
              label={option}
              onPress={() => handlePress(index)}
              variant={getVariant(index)}
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
