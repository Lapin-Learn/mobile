import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { useGameStore } from '~/hooks/zustand';
import { MatchingQuestion, PairAnswer } from '~/lib/types';
import { cn } from '~/lib/utils';

import { Loading } from '../Loading';

export const Matching = () => {
  const { questions, currentQuestion, isChecking, isCorrect, checkAnswer } = useGameStore();
  const [selectingPairs, setSelectingPairs] = useState<PairAnswer>({
    columnA: [],
    columnB: [],
  });
  const [selectedPairs, setSelectedPairs] = useState<PairAnswer[]>([]);

  const clearSelections = () => {
    setSelectingPairs({ columnA: [], columnB: [] });
  };

  const indexOfPair = (value: string) => {
    const valueInPairA = selectedPairs.find((pair) => pair.columnA.includes(value));
    const valueInPairB = selectedPairs.find((pair) => pair.columnB.includes(value));

    if (valueInPairA) {
      return selectedPairs.indexOf(valueInPairA) === -1 ? null : selectedPairs.indexOf(valueInPairA) + 1;
    }

    if (valueInPairB) {
      return selectedPairs.indexOf(valueInPairB) === -1 ? null : selectedPairs.indexOf(valueInPairB) + 1;
    }

    return null;
  };

  const handlePressColA = (value: string) => {
    if (value === selectingPairs.columnA[0]) {
      setSelectingPairs({ ...selectingPairs, columnA: [] });
    } else {
      setSelectingPairs({ ...selectingPairs, columnA: [value] });
    }
    if (indexOfPair(value)) {
      setSelectedPairs((pairs) => pairs.filter((pair) => pair.columnA[0] !== value));
      setSelectingPairs({ ...selectingPairs, columnB: [] });
    }
  };

  const handlePressColB = (value: string) => {
    if (value === selectingPairs.columnB[0]) {
      setSelectingPairs({ ...selectingPairs, columnB: [] });
    } else {
      setSelectingPairs({ ...selectingPairs, columnB: [value] });
    }
    if (indexOfPair(value)) {
      setSelectedPairs((pairs) => pairs.filter((pair) => pair.columnB[0] !== value));
      setSelectingPairs({ ...selectingPairs, columnB: [] });
    }
  };

  const checkIsPair = () => {
    return selectingPairs.columnA.length > 0 && selectingPairs.columnB.length > 0;
  };

  const logicRender = (ref: string[], value: string) => {
    let className = '';
    className += cn('border-2 bg-background', ref.includes(value) ? ' border-orange-500' : 'border-neutral-200');
    className += indexOfPair(value) ? ' border-orange-500' : '';

    return className;
  };

  if (checkIsPair()) {
    setSelectedPairs([...selectedPairs, selectingPairs]);
    clearSelections();
  }

  const isFullPairs = () => {
    if (!questions[currentQuestion]?.content) return false;
    return selectedPairs.length === (questions[currentQuestion]?.content as MatchingQuestion).answer.length;
  };

  useEffect(() => {
    if (checkIsPair()) {
      setSelectedPairs((prev) => [...prev, selectingPairs]);
      clearSelections();
    }
    if (isFullPairs()) {
      checkAnswer(selectedPairs);
    }
  }, [selectingPairs]);

  if (!questions[currentQuestion]?.content) return <Loading />;

  const pairs = questions[currentQuestion]?.content as MatchingQuestion;
  const colA = pairs.columnA;
  const colB = pairs.columnB;

  return (
    <View>
      <ScrollView>
        <View className='gap-y-4'>
          <View className='gap-y-2'>
            <Text className='text-title-4 font-bold'>{colA.title}</Text>
            <View className='gap-y-3'>
              {colA.options.map((value, index) => (
                <Button
                  key={index}
                  className={cn(
                    `w-full overflow-hidden px-6 py-3`,
                    logicRender(selectingPairs.columnA, value),
                    isChecking && isCorrect && 'border-green-400 bg-green-50',
                    isChecking && !isCorrect && 'border-red-400 bg-red-50'
                  )}
                  onPress={() => handlePressColA(value)}>
                  <Text
                    className={cn(
                      'text-center text-body text-neutral-900',
                      isChecking && isCorrect && 'text-green-700',
                      isChecking && !isCorrect && 'text-red-700'
                    )}>
                    {value}
                  </Text>
                  {selectedPairs && (
                    <View
                      className={cn(
                        'absolute right-0 top-0 h-6 w-6 items-center justify-center',
                        indexOfPair(value) ? 'bg-orange-500' : '',
                        isChecking && isCorrect && 'bg-green-400',
                        isChecking && !isCorrect && 'bg-red-400'
                      )}>
                      <Text className='text-center text-white'>{indexOfPair(value)}</Text>
                    </View>
                  )}
                </Button>
              ))}
            </View>
          </View>
          <View className='gap-y-2'>
            <Text className='text-title-4 font-bold'>{colB.title}</Text>
            <View className='gap-y-3'>
              {colB.options.map((value, index) => (
                <Button
                  key={index}
                  className={cn(
                    `w-full px-5 py-3`,
                    logicRender(selectingPairs.columnB, value),
                    isChecking && isCorrect && 'border-green-400 bg-green-50',
                    isChecking && !isCorrect && 'border-red-400 bg-red-50'
                  )}
                  onPress={() => handlePressColB(value)}>
                  <Text
                    className={cn(
                      'text-center text-body text-neutral-900',
                      isChecking && isCorrect && 'text-green-700',
                      isChecking && !isCorrect && 'text-red-700'
                    )}>
                    {value}
                  </Text>
                  {selectedPairs && (
                    <View
                      className={cn(
                        'absolute right-0 top-0 h-6 w-6 items-center justify-center',
                        indexOfPair(value) ? 'bg-orange-500' : '',
                        isChecking && isCorrect && 'bg-green-400',
                        isChecking && !isCorrect && 'bg-red-400'
                      )}>
                      <Text className='text-center text-white'>{indexOfPair(value)}</Text>
                    </View>
                  )}
                </Button>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
