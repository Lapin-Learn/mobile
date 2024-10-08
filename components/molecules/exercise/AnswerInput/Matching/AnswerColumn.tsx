import { Dispatch, SetStateAction } from 'react';
import { Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { useGameStore } from '~/hooks/zustand';
import { PairAnswer } from '~/lib/types';
import { cn } from '~/lib/utils';

/**
 * A: Column A
 *
 * B: Column B
 */
export enum Column {
  A = 'columnA',
  B = 'columnB',
}

type AnswerColumnProps = {
  column: Column;
  title: string | undefined;
  options: string[] | undefined;
  selectingPairs: PairAnswer;
  selectedPairs: PairAnswer[];
  setSelectingPairs: Dispatch<SetStateAction<PairAnswer>>;
  setSelectedPairs: Dispatch<SetStateAction<PairAnswer[]>>;
};

export const AnswerColumn = ({
  column,
  title = '',
  options = [],
  selectingPairs,
  selectedPairs,
  setSelectingPairs,
  setSelectedPairs,
}: AnswerColumnProps) => {
  const { isChecking, isCorrect } = useGameStore();

  const findIndexOfPair = (value: string) => {
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

  const handlePress = (value: string, column: Column) => {
    const otherCol = column === Column.A ? Column.B : Column.A;
    if (value === selectingPairs[column][0]) {
      setSelectingPairs({ ...selectingPairs, [column]: [] });
    } else {
      setSelectingPairs({ ...selectingPairs, [column]: [value] });
    }
    if (findIndexOfPair(value)) {
      setSelectedPairs((pairs) => pairs.filter((pair) => pair[column][0] !== value));
      setSelectingPairs({ ...selectingPairs, [otherCol]: [] });
    }
  };

  const renderClassName = (ref: string[], value: string) => {
    return cn(
      'border-2 bg-background text-center text-body text-neutral-900',
      ref.includes(value) ? ' border-orange-500' : 'border-neutral-200'
    );
  };

  const renderComponent = (component: 'Button' | 'Text' | 'View') => {
    if (!isChecking) return '';

    const styles = {
      Button: isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50',
      Text: isCorrect ? 'text-green-700' : 'text-red-700',
      View: isCorrect ? 'bg-green-400' : 'bg-red-400',
    };

    return styles[component];
  };
  return (
    <View className='gap-y-2'>
      <Text className='text-title-4 font-bold'>{title}</Text>
      <View className='gap-y-3'>
        {options.map((value, index) => (
          <Button
            key={index}
            className={cn(
              `w-full overflow-hidden px-6 py-3`,
              renderClassName(selectingPairs[column], value),
              findIndexOfPair(value) ? ' border-orange-500' : '',
              renderComponent('Button')
            )}
            onPress={() => handlePress(value, column)}>
            <Text className={cn(renderComponent('Text'))}>{value}</Text>
            {selectedPairs && (
              <View
                className={cn(
                  'absolute right-0 top-0 h-6 w-6 items-center justify-center',
                  findIndexOfPair(value) ? 'bg-orange-500' : '',
                  renderComponent('View')
                )}>
                <Text className='text-center text-white'>{findIndexOfPair(value)}</Text>
              </View>
            )}
          </Button>
        ))}
      </View>
    </View>
  );
};
