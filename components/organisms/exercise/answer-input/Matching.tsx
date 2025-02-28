import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import MatchingItem from '~/components/molecules/MatchingItem';
import { BaseAnswerInputProps } from '~/components/organisms/exercise/answer-input/AnswerInput';
import Styles from '~/constants/GlobalStyles';
import { MatchingContent, PairAnswer } from '~/lib/types/questions';
import { getBackgroundColorCorrectness } from '~/lib/utils/colorUtils';

import ButtonCheck from '../ButtonCheck';

type MatchingProps = MatchingContent & BaseAnswerInputProps;

const Matching = ({ answer, columnA, columnB, onAnswer, result, textColumnKey = 'columnA' }: MatchingProps) => {
  const [selected, setSelected] = useState<PairAnswer[]>([]);
  const [correctness, setCorrectness] = useState<boolean[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { t } = useTranslation('question');

  const textColumn = textColumnKey === 'columnA' ? columnA : columnB;
  const selectColumn = textColumnKey === 'columnA' ? columnB : columnA;

  const selectColumnKey = textColumnKey === 'columnA' ? 'columnB' : 'columnA';

  const isNotAnswered = result.numberOfCorrect === 0 && result.totalOfQuestions === 0;
  const answerRecord = answer.reduce<Record<string, string>>((acc, pair) => {
    acc[pair[textColumnKey][0]] = pair[selectColumnKey][0];
    return acc;
  }, {});

  const answerQuestion = () => {
    const correctness = selected.map((pair) => answerRecord[pair[textColumnKey][0]] === pair[selectColumnKey][0]);
    const statistic = {
      numberOfCorrect: correctness.filter((item) => item).length,
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

  const handleSelect = (selection: string, label: string) => {
    const filtered = selected.filter((pair) => pair[textColumnKey][0] !== label);
    setSelected([...filtered, { [textColumnKey]: [label], [selectColumnKey]: [selection] } as PairAnswer]);
  };

  return (
    <>
      <ScrollView>
        <View style={[{ gap: 16, marginBottom: 120 }]}>
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
                  correctness.length ? getBackgroundColorCorrectness(correctness[index]) : {},
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
                correctness={correctness[index]}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      {isChecking && <ButtonCheck handleCheckAnswer={answerQuestion} content={t('general.check')} />}
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
