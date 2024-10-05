import { Check } from 'lucide-react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { cn } from '~/lib/utils';

import * as CheckboxPrimitive from '../primitives/checkbox';

type ChoiceCheckBoxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  className?: string;
  index: number;
  label: string;
  selectedBox?: number[] | null;
  isChecking?: boolean;
  isCorrect?: boolean;
  checked?: boolean;
  onPress: () => void;
};

const ChoiceCheckBox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, ChoiceCheckBoxProps>(
  ({ className, index, label, selectedBox, checked, isChecking, isCorrect, onPress, ...props }, ref) => {
    const checkingSelected = isChecking && selectedBox?.includes(index);
    return (
      <View className='mb-3 flex w-full flex-row items-center gap-4'>
        <CheckboxPrimitive.Root
          ref={ref}
          className={cn(
            'h-10 w-10 shrink-0 rounded-sm border-2 border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
            selectedBox?.includes(index) && 'border-2 border-orange-500 bg-orange-50',
            checkingSelected && isCorrect && 'border-green-400 bg-green-50 text-green-700',
            checkingSelected && !isCorrect && 'border-red-400 bg-red-100 text-red-700',
            className
          )}
          checked={selectedBox?.includes(index) || false}
          onPress={onPress}
          {...props}>
          <CheckboxPrimitive.Indicator className={cn('h-full w-full items-center justify-center')}>
            <Check size={20} color={checkingSelected ? (isCorrect ? 'green' : 'red') : 'black'} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <Text className='shrink text-body font-semibold'>{label}</Text>
      </View>
    );
  }
);
ChoiceCheckBox.displayName = CheckboxPrimitive.Root.displayName;

export { ChoiceCheckBox };
