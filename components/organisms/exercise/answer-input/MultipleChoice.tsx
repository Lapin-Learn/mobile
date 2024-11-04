import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import ChoiceButton from '~/components/molecules/exercise/ChoiceButton';
import { ChoiceCheckBox } from '~/components/molecules/exercise/ChoiceCheckBox';
import { Button } from '~/components/ui/Button';
import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
import { GLOBAL_STYLES } from '~/lib/constants';
import { MultipleChoiceContent } from '~/lib/types/questions';

type MultipleChoiceProps = MultipleChoiceContent & {
  onAnswer: (isCorrect: boolean) => void;
  result: Answer;
};

const MultipleChoice = ({ options, answer, onAnswer, result }: MultipleChoiceProps) => {
  const { t } = useTranslation('question');
  const [selected, setSelected] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const answerQuestion = () => {
    const isCorrect = selected.every((index) => answer.includes(index));
    onAnswer(isCorrect);
  };

  useEffect(() => {
    if (result === 'notAnswered') setSelected([]);
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
      {isChecking && (
        <View style={styles.buttonView}>
          <Button variant='black' size='lg' onPress={answerQuestion}>
            <Text style={GLOBAL_STYLES.textButton}>{t('general.check')}</Text>
          </Button>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    marginHorizontal: 16,
  },
});

export default MultipleChoice;
