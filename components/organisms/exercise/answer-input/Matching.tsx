import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import Styles from '~/constants/GlobalStyles';
import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
import { GLOBAL_STYLES } from '~/lib/constants';
import { MatchingContent, PairAnswer } from '~/lib/types/questions';

type MatchingProps = MatchingContent & {
  onAnswer: (answer: Answer) => void;
  result: Answer;
};

const Matching = ({ answer, columnA, columnB, onAnswer, result }: MatchingProps) => {
  const [selected, setSelected] = useState<PairAnswer[]>([]);
  const [correctness, setCorrectness] = useState<boolean[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { t } = useTranslation('question');

  const isNotAnswered = result.numberOfCorrect === 0 && result.totalOfQuestions === 0;
  const answerRecord = answer.reduce<Record<string, string>>((acc, pair) => {
    acc[pair.columnB[0]] = pair.columnA[0];
    return acc;
  }, {});

  const answerQuestion = () => {
    const correctness = selected.map((pair) => answerRecord[pair.columnB[0]] === pair.columnA[0]);
    const statistic = {
      numberOfCorrect: correctness.filter((item) => item === true).length,
      totalOfQuestions: selected.length,
    };

    setCorrectness(correctness);
    onAnswer(statistic);
  };

  useEffect(() => {
    if (isNotAnswered) {
      setSelected([]);
      setCorrectness([]);
    }
  }, [result]);

  useEffect(() => {
    if (selected.length === answer.length) {
      setIsChecking(true);
    } else {
      setIsChecking(false);
    }
  }, [selected]);

  const handleSelect = (a: string, b: string) => {
    const isBSelected = selected.some((pair) => pair.columnB.includes(b));

    if (isBSelected) {
      const filtered = selected.filter((pair) => !pair.columnB.includes(b));
      setSelected([...filtered, { columnA: [a], columnB: [b] }]);
    } else {
      setSelected((prev) => [...prev, { columnA: [a], columnB: [b] }]);
    }
  };

  return (
    <>
      <ScrollView>
        <View style={[{ gap: 16 }, isChecking ? { marginBottom: 88 } : { marginBottom: 40 }]}>
          {columnB.options.map((option, index) => (
            <View key={option}>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <View
                  style={[
                    styles.circle,
                    correctness.length
                      ? correctness[index]
                        ? { ...Styles.backgroundColor.green[500] }
                        : { ...Styles.backgroundColor.red[500] }
                      : {},
                  ]}>
                  <Text
                    style={[
                      styles.text,
                      correctness.length
                        ? correctness[index]
                          ? { ...Styles.color.green[50] }
                          : { ...Styles.color.red[50] }
                        : {},
                    ]}>
                    {index + 1}
                  </Text>
                </View>
                <Select
                  onValueChange={(value) => value && handleSelect(value.value, option)}
                  style={{
                    maxWidth: '50%',
                    minWidth: '20%',
                  }}>
                  <SelectTrigger disabled={correctness.length !== 0}>
                    <SelectValue placeholder={columnA.title} style={{ ...Styles.fontSize.body }} />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      width: '80%',
                    }}>
                    <SelectGroup>
                      {columnA.options.map((item) => (
                        <SelectItem key={item} label={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {option.split(' ').map((word, id) => (
                  <Text key={`${word}-${id}`} style={{ ...Styles.fontSize.body }}>
                    {word}
                  </Text>
                ))}
              </View>
              {correctness.length !== 0 && (
                <Text style={{ ...Styles.font.bold }}>
                  {t('general.correctAnswer')} {answerRecord[option]}
                </Text>
              )}
            </View>
          ))}
        </View>
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

export default Matching;

const styles = StyleSheet.create({
  circle: {
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Styles.backgroundColor.blue[500],
  },
  text: {
    ...Styles.font.bold,
    ...Styles.fontSize.body,
    ...Styles.color.blue[50],
  },
});
