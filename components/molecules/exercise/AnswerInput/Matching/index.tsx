import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { Answer } from '~/hooks/useLesson';
import { PairAnswer } from '~/lib/types';
import { MatchingContent } from '~/lib/types/questions';

import { AnswerColumn, Column } from './AnswerColumn';

interface MatchingProps extends MatchingContent {
  onAnswer: (isCorrect: boolean) => void;
  result: Answer;
}

const Matching = ({ answer, columnA, columnB, onAnswer, result }: MatchingProps) => {
  const [selectingPairs, setSelectingPairs] = useState<PairAnswer>({
    columnA: [],
    columnB: [],
  });
  const [selectedPairs, setSelectedPairs] = useState<PairAnswer[]>([]);
  const [correctness, setCorrectness] = useState<boolean[]>(Array(answer.length).fill(false));
  const { t } = useTranslation('question');

  const answerQuestion = () => {
    let isCorrect: boolean = true;
    for (let i = 0; i < selectedPairs.length; i++) {
      const index = answer.findIndex((pair) => pair.columnA.includes(selectedPairs[i].columnA[0]));
      if (index >= 0) {
        if (selectedPairs[i].columnB[0] !== answer[index].columnB[0]) {
          isCorrect = false;
        } else {
          correctness[index] = true;
        }
      } else {
        isCorrect = false;
      }
    }
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
      <View>
        <ScrollView>
          <View className='gap-y-4'>
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
      </View>
      {selectedPairs.length === answer.length && (
        <View className='absolute bottom-0 left-0 right-0 bg-background p-4 pb-10'>
          <Button className='bg-neutral-900' onPress={answerQuestion}>
            <Text className='text-button'>{t('general.check')}</Text>
          </Button>
        </View>
      )}
    </>
  );
};

export default Matching;
