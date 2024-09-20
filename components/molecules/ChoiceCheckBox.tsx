import { useState } from 'react';
import { Text, View } from 'react-native';

import { Checkbox } from '../ui/Checkbox';

type ChoiceCheckBoxProps = {
  label: string;
  index: number;
  selectedBox?: number[] | null;
  isChecking?: boolean;
  isCorrect?: boolean;
  onPress: () => void;
};

export default function ChoiceCheckBox({
  label,
  index,
  selectedBox,
  isChecking,
  isCorrect,
  onPress,
}: ChoiceCheckBoxProps) {
  const [checked, setChecked] = useState(false);
  return (
    <View className='flex flex-row items-center gap-4 mb-3 w-full'>
      <Checkbox
        className={`${isChecking && selectedBox?.includes(index) && isCorrect ? 'border-green-400 bg-green-50 text-green-700' : ''} ${isChecking && selectedBox?.includes(index) && !isCorrect ? 'border-red-400 bg-red-50 text-red-700' : ''}`}
        checked={checked}
        onCheckedChange={() => setChecked(!checked)}
      />
      <Text className='text-body font-semibold'>{label}</Text>
    </View>
  );
}
