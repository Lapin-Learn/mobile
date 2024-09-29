import { useState } from 'react';
import { View } from 'react-native';

import ChoiceButton from '~/components/molecules/ChoiceButton';
import { useGameStore } from '~/hooks/zustand';

import { ChoiceCheckBox } from '../ChoiceCheckBox';

export default function MultipleChoice() {
  const { questions, currentQuestion, selected, isChecking, isCorrect, handleSingleSelect, handleMultipleSelect } =
    useGameStore();
  const [checkedBox, setCheckedBox] = useState<boolean>(false);

  const handlePress = (index: number) => {
    if (questions[currentQuestion]?.content.answer.length > 1) {
      handleMultipleSelect(index);
    } else {
      handleSingleSelect(index);
    }
  };

  return (
    <View>
      {questions[currentQuestion]?.content.options?.map((option, index) => {
        if (questions[currentQuestion]?.content.answer.length > 1) {
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
    </View>
  );
}
