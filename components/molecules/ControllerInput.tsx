import { Text, TextInputProps, View } from 'react-native';

import { FormInputProps, useFormInput } from '~/hooks/useFormInput';

export function ControllerInput<T>({
  props,
  label,
  placeholder,
  error,
  type = 'text',
  defaultLabel = '',
  options = [],
  ...rest
}: FormInputProps<T> & TextInputProps) {
  const { renderInput, field } = useFormInput({
    props,
    label,
    placeholder,
    error,
    type,
    defaultLabel,
    options,
  });

  return (
    <View className='w-full flex-col items-start justify-start gap-1'>
      <Text className='text-lg font-semibold text-neutral-900'>{label}</Text>
      <View className='flex w-full flex-row gap-x-1'>
        <View className='flex w-full grow flex-row items-center justify-center rounded-md'>
          {renderInput({
            value: field.value,
            onChangeText: field.onChange,
            onBlur: field.onBlur,
            ...rest,
          })}
        </View>
      </View>
      {error && <Text className='text-red-500'>{String(error.message)}</Text>}
    </View>
  );
}
