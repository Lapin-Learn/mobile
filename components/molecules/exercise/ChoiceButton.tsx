import { cva, VariantProps } from 'class-variance-authority';
import { Text } from 'react-native';

import { Button, ButtonProps } from '../../ui/Button';

const choiceButtonVariants = cva('border-2 mb-3 w-full px-5 py-3', {
  variants: {
    variant: {
      default: 'border-neutral-200 bg-background',
      correct: 'border-green-400 bg-green-50 text-green-700',
      incorrect: 'border-red-400 bg-red-50 text-red-700',
      selected: 'border-orange-500 bg-background',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type ChoiceButtonProps = Omit<ButtonProps, 'variant'> &
  VariantProps<typeof choiceButtonVariants> & {
    label: string;
  };
const ChoiceButton = ({ variant, label, ...props }: ChoiceButtonProps) => {
  return (
    <Button className={choiceButtonVariants({ variant })} {...props}>
      <Text className='text-center text-body text-neutral-900'>{label}</Text>
    </Button>
  );
};

export default ChoiceButton;
