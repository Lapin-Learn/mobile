import { Text } from 'react-native';

import { Button } from '../ui/Button';

type ChoiceButtonProps = {
  label: string;
  index: number;
  selectedBox?: number | null;
  isChecking?: boolean;
  isCorrect?: boolean;
  onPress: () => void;
};

export default function ChoiceButton({ label, index, selectedBox, onPress, isChecking, isCorrect }: ChoiceButtonProps) {
  return (
    <Button
      className={`mb-3 w-full rounded-lg px-5 py-3 font-bold ${selectedBox === index ? 'border-2 border-orange-500 bg-background' : 'border-2 border-neutral-200 bg-background'} ${isChecking && selectedBox === index && isCorrect ? 'border-green-400 bg-green-50 text-green-700' : ''} ${isChecking && selectedBox === index && !isCorrect ? 'border-red-400 bg-red-50 text-red-700' : ''}`}
      onPress={onPress}>
      <Text className='text-body font-semibold text-neutral-900'>{label}</Text>
    </Button>
  );
}
