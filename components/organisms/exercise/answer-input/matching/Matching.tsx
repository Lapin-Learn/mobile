import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
import { GLOBAL_STYLES } from '~/lib/constants';
import { MatchingContent, PairAnswer } from '~/lib/types/questions';

import { AnswerColumn, Column } from './AnswerColumn';

type MatchingProps = MatchingContent & {
  onAnswer: (isCorrect: boolean) => void;
  result: Answer;
};

const Matching = ({ answer, columnA, columnB, onAnswer, result }: MatchingProps) => {
  const [selectingPairs, setSelectingPairs] = useState<PairAnswer>({
    columnA: [],
    columnB: [],
  });
  const [selectedPairs, setSelectedPairs] = useState<PairAnswer[]>([]);
  const [correctness, setCorrectness] = useState<boolean[]>(Array(answer.length).fill(false));
  const [isChecking, setIsChecking] = useState(false);
  const { t } = useTranslation('question');

  const answerQuestion = () => {
    const answerRecord = answer.reduce<Record<string, string>>((acc, pair) => {
      acc[pair.columnA[0]] = pair.columnB[0];
      return acc;
    }, {});
    const correctness = selectedPairs.map((pair) => answerRecord[pair.columnA[0]] === pair.columnB[0]);
    const isCorrect = correctness.every(Boolean);

    setCorrectness(correctness);
    onAnswer(isCorrect);
  };

  useEffect(() => {
    if (result === 'notAnswered') {
      setSelectedPairs([]);
      setSelectingPairs({
        columnA: [],
        columnB: [],
      });
    }
  }, [result]);

  useEffect(() => {
    const isFullPair = selectingPairs.columnA.length > 0 && selectingPairs.columnB.length > 0;
    if (isFullPair) {
      setSelectedPairs((prev) => [...prev, selectingPairs]);
      setSelectingPairs({
        columnA: [],
        columnB: [],
      });
    }
    if (selectedPairs.length === answer.length) {
      setIsChecking(true);
    } else {
      setIsChecking(false);
    }
  }, [selectingPairs]);

  return (
    <>
      <ScrollView>
        <View style={[{ gap: 16 }, isChecking ? { marginBottom: 88 } : { marginBottom: 40 }]}>
          <AnswerColumn
            column={Column.A}
            title={columnA.title}
            options={columnA.options}
            selectingPairs={selectingPairs}
            selectedPairs={selectedPairs}
            setSelectingPairs={setSelectingPairs}
            setSelectedPairs={setSelectedPairs}
            correctness={correctness}
            isChecking={result !== 'notAnswered'}
          />
          <AnswerColumn
            column={Column.B}
            title={columnB.title}
            options={columnB.options}
            selectingPairs={selectingPairs}
            selectedPairs={selectedPairs}
            setSelectingPairs={setSelectingPairs}
            setSelectedPairs={setSelectedPairs}
            correctness={correctness}
            isChecking={result !== 'notAnswered'}
          />
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
