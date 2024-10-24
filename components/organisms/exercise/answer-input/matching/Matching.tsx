import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { Answer } from '~/hooks/zustand/useDailyLessonQuestionStore';
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
  }, [selectingPairs]);

  return (
    <>
      <ScrollView>
        <View className='mb-10 gap-y-4'>
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
      {selectedPairs.length === answer.length && (
        <View className='absolute bottom-0 left-0 right-0 mb-12 bg-background'>
          <Button className='bg-neutral-900' onPress={answerQuestion}>
            <Text className='text-button'>{t('general.check')}</Text>
          </Button>
        </View>
      )}
    </>
  );
};

export default Matching;
