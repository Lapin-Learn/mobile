import { Text } from 'react-native';

import { Button } from '../ui/Button';

type ChoiceButtonProps = {
  label: string;
  index: number;
  selectedBox?: number[];
  isChecking?: boolean;
  isCorrect?: boolean;
  onPress: () => void;
};

export default function ChoiceButton({ label, index, selectedBox, onPress, isChecking, isCorrect }: ChoiceButtonProps) {
  return (
    <Button
      className={`mb-3 w-full px-5 py-3 ${selectedBox?.includes(index) ? 'border-2 border-orange-500 bg-background' : 'border-2 border-neutral-200 bg-background'} ${isChecking && selectedBox?.includes(index) && isCorrect ? 'border-green-400 bg-green-50 text-green-700' : ''} ${isChecking && selectedBox?.includes(index) && !isCorrect ? 'border-red-400 bg-red-50 text-red-700' : ''}`}
      onPress={onPress}>
      <Text className='text-body text-center text-neutral-900'>{label}</Text>
    </Button>
  );
}
