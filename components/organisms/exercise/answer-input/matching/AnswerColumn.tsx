import { cva } from 'class-variance-authority';
import { Dispatch, SetStateAction } from 'react';
import { Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import { PairAnswer } from '~/lib/types/questions';

/**
 * A: Column A
 *
 * B: Column B
 */
export enum Column {
  A = 'columnA',
  B = 'columnB',
}

const buttonVariants = cva('overflow-hidden border bg-background text-center text-body text-neutral-900', {
  variants: {
    variant: {
      default: 'border-neutral-300',
      selected: 'border-orange-500',
      correct: 'border-green-400',
      incorrect: 'border-red-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const textVariants = cva('text-center text-body text-neutral-900', {
  variants: {
    variant: {
      default: '',
      correct: 'text-green-700',
      incorrect: 'text-red-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const viewVariants = cva('absolute right-0 top-0 h-6 w-6 items-center justify-center', {
  variants: {
    variant: {
      default: '',
      selected: 'bg-orange-500',
      correct: 'bg-green-400',
      incorrect: 'bg-red-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type AnswerColumnProps = {
  column: Column;
  title: string | undefined;
  options: string[] | undefined;
  selectingPairs: PairAnswer;
  selectedPairs: PairAnswer[];
  setSelectingPairs: Dispatch<SetStateAction<PairAnswer>>;
  setSelectedPairs: Dispatch<SetStateAction<PairAnswer[]>>;
  correctness?: boolean[];
  isChecking?: boolean;
};

export const AnswerColumn = ({
  column,
  title = '',
  options = [],
  selectingPairs,
  selectedPairs,
  setSelectingPairs,
  setSelectedPairs,
  correctness = [],
  isChecking = false,
}: AnswerColumnProps) => {
  const findIndexOfPair = (value: string) => {
    const valueInPairA = selectedPairs.find((pair) => pair.columnA.includes(value));
    const valueInPairB = selectedPairs.find((pair) => pair.columnB.includes(value));
    if (valueInPairA) {
      return selectedPairs.indexOf(valueInPairA) === -1 ? null : selectedPairs.indexOf(valueInPairA) + 1;
    }

    if (valueInPairB) {
      return selectedPairs.indexOf(valueInPairB) === -1 ? null : selectedPairs.indexOf(valueInPairB) + 1;
    }
    if (selectingPairs.columnA.includes(value) || selectingPairs.columnB.includes(value)) {
      return selectedPairs.length + 1;
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

  return (
    <View className='gap-y-2'>
      <Text className='text-title-4 font-bold'>{title}</Text>
      <View className='gap-y-3'>
        {options.map((value, index) => {
          const pairIndex = findIndexOfPair(value);
          const isCorrect = pairIndex ? correctness[pairIndex - 1] : false;
          return (
            <Button
              key={index}
              className={buttonVariants({
                variant: pairIndex ? (isChecking ? (isCorrect ? 'correct' : 'incorrect') : 'selected') : 'default',
              })}
              onPress={() => handlePress(value, column)}>
              <Text
                className={textVariants({
                  variant: isChecking ? (isCorrect ? 'correct' : 'incorrect') : 'default',
                })}>
                {value}
              </Text>
              {selectedPairs && (
                <View
                  className={viewVariants({
                    variant: pairIndex ? (isChecking ? (isCorrect ? 'correct' : 'incorrect') : 'selected') : 'default',
                  })}>
                  <Text className='text-center text-white'>{findIndexOfPair(value)}</Text>
                </View>
              )}
            </Button>
          );
        })}
      </View>
    </View>
  );
};
