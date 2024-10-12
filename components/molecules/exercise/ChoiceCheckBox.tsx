import { cva, VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import * as CheckboxPrimitive from '../../primitives/checkbox';

const choiceButtonVariants = cva(
  'h-10 w-10 shrink-0 rounded-sm border-2 disabled:cursor-not-allowed disabled:opacity-50 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-neutral-900',
        correct: 'border-green-400 bg-green-50 text-green-700',
        incorrect: 'border-red-400 bg-red-50 text-red-700',
        selected: 'border-orange-500 bg-orange-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type ChoiceCheckBoxProps = VariantProps<typeof choiceButtonVariants> &
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label: string;
    checked?: boolean;
    onPress: () => void;
  };

const ChoiceCheckBox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, ChoiceCheckBoxProps>(
  ({ variant, label, checked = false, onPress, ...props }, ref) => {
    return (
      <View className='mb-3 flex w-full flex-row items-center gap-4'>
        <CheckboxPrimitive.Root
          ref={ref}
          className={choiceButtonVariants({ variant })}
          checked={checked}
          onPress={onPress}
          {...props}>
          <CheckboxPrimitive.Indicator className='h-full w-full items-center justify-center'>
            <Check size={20} color={checked ? 'black' : 'black'} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <Text className='shrink font-isemibold text-body'>{label}</Text>
      </View>
    );
  }
);

ChoiceCheckBox.displayName = CheckboxPrimitive.Root.displayName;

export { ChoiceCheckBox };
