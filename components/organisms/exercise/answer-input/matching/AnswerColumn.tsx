import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';
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

const viewStyles = StyleSheet.create({
  root: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {},
  selected: {
    ...Styles.backgroundColor.orange[500],
  },
  correct: {
    ...Styles.backgroundColor.green[400],
  },
  incorrect: {
    ...Styles.backgroundColor.red[400],
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
    <View style={{ gap: 4 }}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.list}>
        {options.map((value, index) => {
          const pairIndex = findIndexOfPair(value);
          const isCorrect = pairIndex ? correctness[pairIndex - 1] : false;
          return (
            <Button
              key={index}
              style={StyleSheet.flatten([
                buttonStyles.root,
                buttonStyles[pairIndex ? (isChecking ? (isCorrect ? 'correct' : 'incorrect') : 'selected') : 'default'],
              ])}
              onPress={() => handlePress(value, column)}>
              <Text
                style={StyleSheet.flatten([
                  textStyles.root,
                  textStyles[isChecking ? (isCorrect ? 'correct' : 'incorrect') : 'default'],
                ])}>
                {value}
              </Text>
              {selectedPairs && (
                <View
                  style={StyleSheet.flatten([
                    viewStyles.root,
                    viewStyles[
                      pairIndex ? (isChecking ? (isCorrect ? 'correct' : 'incorrect') : 'selected') : 'default'
                    ],
                  ])}>
                  <Text style={{ ...Styles.fontSize['caption-1'], color: 'white', textAlign: 'center' }}>
                    {findIndexOfPair(value)}
                  </Text>
                </View>
              )}
            </Button>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    ...Styles.font.bold,
    ...Styles.fontSize['title-4'],
  },
  list: {
    gap: 8,
  },
});

const buttonStyles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    borderWidth: 1,
    ...Styles.backgroundColor.background,
    textAlign: 'center',
    ...Styles.font.normal,
    ...Styles.fontSize.body,
  },
  default: {
    ...Styles.borderColor.neutral[100],
  },
  selected: {
    ...Styles.borderColor.orange[500],
  },
  correct: {
    ...Styles.borderColor.green[400],
  },
  incorrect: {
    ...Styles.borderColor.red[400],
  },
});

const textStyles = StyleSheet.create({
  root: {
    textAlign: 'center',
    ...Styles.font.normal,
    ...Styles.fontSize.body,
  },
  default: {
    ...Styles.color.neutral[900],
  },
  correct: {
    ...Styles.color.green[700],
  },
  incorrect: {
    ...Styles.color.red[700],
  },
});
