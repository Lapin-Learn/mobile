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
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} key={option}>
                <Text
                  style={[
                    textStyles.root,
                    correctness.length ? (correctness[index] ? textStyles.correct : textStyles.incorrect) : {},
                  ]}>
                  {index + 1}
                </Text>
                <Select
                  onValueChange={(value) => value && handleSelect(value.value, option)}
                  style={{
                    maxWidth: '50%',
                  }}>
                  <SelectTrigger>
                    <SelectValue placeholder={columnA.title} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {columnA.options.map((item) => (
                        <SelectItem key={item} label={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Text style={{ ...Styles.fontSize.body, flexWrap: 'wrap', flex: 1 }}>{option}</Text>
              </View>
              {correctness.length !== 0 && (
                <Text style={{ ...Styles.font.bold }}>
                  {t('general.correctAnswer')} {answerRecord[option]}
                </Text>
              )}
            </>
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

const textStyles = StyleSheet.create({
  root: {
    padding: 4,
    borderWidth: 1,
    ...Styles.borderColor.neutral[200],
    borderRadius: 64,
    width: 32,
    height: 32,
    textAlign: 'center',
  },
  correct: {
    ...Styles.borderColor.green[500],
    ...Styles.color.green[500],
  },
  incorrect: {
    ...Styles.borderColor.red[500],
    ...Styles.color.red[500],
  },
});
