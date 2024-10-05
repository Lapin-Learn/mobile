import { TextInput, TextInputProps } from 'react-native';

import { cn } from '~/lib/utils';

export default function CustomTextInput({ className, ...props }: TextInputProps) {
  return (
    <TextInput
      className={cn(
        'w-full rounded border border-neutral-200 bg-white p-3 text-subhead font-medium placeholder:text-neutral-700',
        className
      )}
      {...props}
    />
  );
}
