import { FieldError, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

export type ControllerInputProps<T = Record<string, string>> = {
  props: UseControllerProps<T & FieldValues>;
  label: string;
  placeholder: string;
  error: FieldError | undefined;
};
export function ControllerInput<T>({ props, label, placeholder, error }: ControllerInputProps<T>) {
  const { field } = useController(props);

  return (
    <View className='w-full flex-col items-start justify-start gap-1'>
      <Text className='text-lg font-semibold text-neutral-900'>{label}</Text>
      <View className='flex w-full flex-row gap-x-1'>
        <View className='flex w-full grow flex-row items-center justify-center rounded'>
          <TextInput
            className='h-fit-content w-full rounded border border-neutral-200 bg-white p-3 text-justify text-subhead font-medium placeholder:text-start placeholder:text-neutral-700'
            placeholder={placeholder}
            value={field.value === 0 ? '' : field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        </View>
      </View>
      {error && <Text className='text-red-500'>{String(error.message)}</Text>}
    </View>
  );
}
