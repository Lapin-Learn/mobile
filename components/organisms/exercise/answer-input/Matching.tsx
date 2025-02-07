import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import MatchingItem from '~/components/molecules/MatchingItem';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
import { GLOBAL_STYLES } from '~/lib/constants';
import { MatchingContent, PairAnswer } from '~/lib/types/questions';

type MatchingProps = MatchingContent & {
  onAnswer: (answer: Answer) => void;
  result: Answer;
};

const Matching = ({ answer, columnA, columnB, onAnswer, result, textColumnKey = 'columnA' }: MatchingProps) => {
  const [selected, setSelected] = useState<PairAnswer[]>([]);
  const [correctness, setCorrectness] = useState<boolean[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { t } = useTranslation('question');

  const textColumn = textColumnKey === 'columnA' ? columnA : columnB;
  const selectColumn = textColumnKey === 'columnA' ? columnB : columnA;

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
          {textColumn.options.map((label, index) => (
            <View
              key={label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={StyleSheet.flatten([
                  styles.circle,
                  correctness.length
                    ? correctness[index]
                      ? { ...Styles.backgroundColor.green[500] }
                      : { ...Styles.backgroundColor.red[500] }
                    : {},
                  { marginRight: 8 },
                ])}>
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
              <MatchingItem
                showAnswerRecord={correctness.length !== 0}
                answerRecord={answerRecord[label]}
                selectPlaceholder={selectColumn.title}
                label={label}
                options={selectColumn.options}
                onSelect={handleSelect}
                direction={textColumnKey === 'columnA' ? 'ltr' : 'rtl'}
              />
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
    borderRadius: 39,
    height: 30,
    width: 30,
    aspectRatio: 1,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Styles.backgroundColor.blue[100],
  },
  text: {
    ...Styles.font.bold,
    ...Styles.fontSize['caption-1'],
    ...Styles.color.blue[900],
  },
});
