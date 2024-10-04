import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import ChoiceButton from '~/components/molecules/ChoiceButton';
import { useGameStore } from '~/hooks/zustand';
import { MultipleChoiceQuestion } from '~/lib/types';

import { ChoiceCheckBox } from '../ChoiceCheckBox';

export default function MultipleChoice() {
  const { questions, currentQuestion, isChecking, isCorrect, selected, handleMultipleSelect, handleSingleSelect } =
    useGameStore();
  const [checkedBox, setCheckedBox] = useState<boolean>(false);
  const [content, setContent] = useState<MultipleChoiceQuestion>();

  useEffect(() => {
    setCheckedBox(false);
    setContent(questions[currentQuestion]?.content);
  }, [questions, currentQuestion]);

  const handlePress = (index: number) => {
    if (questions[currentQuestion]?.content.answer.length > 1) {
      return handleMultipleSelect(index);
    } else {
      return handleSingleSelect(index);
    }
  };

  return (
    <View>
      <ScrollView>
        {content &&
          content?.options.map((option, index) => {
            if (content.answer.length > 1) {
              return (
                <ChoiceCheckBox
                  key={index}
                  index={index}
                  label={option}
                  selectedBox={selected}
                  isChecking={isChecking}
                  isCorrect={isCorrect}
                  checked={checkedBox}
                  onPress={() => handlePress(index)}
                  onCheckedChange={() => setCheckedBox(selected.includes(index))}
                />
              );
            } else {
              return (
                <ChoiceButton
                  key={index}
                  index={index}
                  label={option}
                  selectedBox={selected}
                  isChecking={isChecking}
                  isCorrect={isCorrect}
                  onPress={() => handlePress(index)}
                />
              );
            }
          })}
      </ScrollView>
    </View>
  );
}
