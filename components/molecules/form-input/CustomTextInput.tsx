import { TextInput, TextInputProps } from 'react-native';

import { cn } from '~/lib/utils';

const CustomTextInput = ({ className, ...props }: TextInputProps) => {
  return (
    <TextInput
      className={cn(
        'w-full rounded border border-neutral-200 bg-white p-3 font-imedium text-subhead placeholder:text-neutral-300',
        className
      )}
      {...props}
    />
  );
};

export default CustomTextInput;
