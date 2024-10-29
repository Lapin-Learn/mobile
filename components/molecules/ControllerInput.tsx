import { useTranslation } from 'react-i18next';
import { Text, TextInputProps, View } from 'react-native';

import { FormInputProps, useFormInput } from '~/hooks/useFormInput';

export const ControllerInput = <T,>({
  props,
  label,
  placeholder,
  error,
  type = 'text',
  defaultLabel = '',
  options = [],
  onChangeText,
  ...rest
}: FormInputProps<T> & TextInputProps) => {
  const { renderInput, field } = useFormInput({
    props,
    label,
    placeholder,
    error,
    type,
    defaultLabel,
    options,
  });
  const { t } = useTranslation();

  return (
    <View className='w-full flex-col items-start justify-start gap-1'>
      <Text className='font-isemibold text-lg text-neutral-900'>{label}</Text>
      <View className='flex w-full flex-row gap-x-1'>
        <View className='flex w-full grow flex-row items-center justify-center rounded-md'>
          {renderInput({
            value: field.value,
            onChangeText: (value: string) => {
              field.onChange(value);
              onChangeText && onChangeText(value);
            },
            onBlur: field.onBlur,
            ...rest,
          })}
        </View>
      </View>
      {error && <Text className='text-red-500'>{t(String(error.message), { ns: 'validation' })}</Text>}
    </View>
  );
};
