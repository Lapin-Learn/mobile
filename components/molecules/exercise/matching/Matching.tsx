import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useGameStore } from '~/hooks/zustand';
import { MatchingQuestion, PairAnswer } from '~/lib/types';

import { AnswerColumn, Column } from './AnswerColumn';

export const Matching = () => {
  const { questions, currentQuestion, checkAnswer } = useGameStore();
  const [content, setContent] = useState<MatchingQuestion>();
  const [selectingPairs, setSelectingPairs] = useState<PairAnswer>({
    columnA: [],
    columnB: [],
  });
  const [selectedPairs, setSelectedPairs] = useState<PairAnswer[]>([]);

  useEffect(() => {
    setContent(questions[currentQuestion]?.content);
    setSelectingPairs({ columnA: [], columnB: [] });
    setSelectedPairs([]);
  }, [questions, currentQuestion]);

  useEffect(() => {
    if (checkIsPair()) {
      setSelectedPairs((prev) => [...prev, selectingPairs]);
      clearSelections();
    }
    if (isFullPairs()) {
      checkAnswer(selectedPairs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectingPairs]);

  const clearSelections = () => {
    setSelectingPairs({ columnA: [], columnB: [] });
  };

  const isFullPairs = () => {
    if (!questions[currentQuestion]?.content) return false;
    return selectedPairs.length === content?.answer.length;
  };

  const checkIsPair = () => {
    return selectingPairs.columnA.length > 0 && selectingPairs.columnB.length > 0;
  };

  return (
    <View>
      <ScrollView>
        <View className='gap-y-4'>
          <AnswerColumn
            column={Column.A}
            title={content?.columnA.title}
            options={content?.columnA.options}
            selectingPairs={selectingPairs}
            selectedPairs={selectedPairs}
            setSelectingPairs={setSelectingPairs}
            setSelectedPairs={setSelectedPairs}
          />
          <AnswerColumn
            column={Column.B}
            title={content?.columnB.title}
            options={content?.columnB.options}
            selectingPairs={selectingPairs}
            selectedPairs={selectedPairs}
            setSelectingPairs={setSelectingPairs}
            setSelectedPairs={setSelectedPairs}
          />
        </View>
      </ScrollView>
    </View>
  );
};
