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
    <>
      <View className='w-full flex-col justify-start items-start gap-1 inline-flex'>
        <Text className='font-semibold text-lg text-neutral-900'>{label}</Text>
        <View className='w-full flex flex-row gap-x-1'>
          <View className='w-full grow flex flex-row justify-center items-center rounded-md'>
            <TextInput
              className='w-full p-3 text-subhead border font-medium placeholder:text-neutral-700 border-neutral-200 bg-white'
              placeholder={placeholder}
              value={field.value === 0 ? '' : field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          </View>
        </View>
      </View>
      {error && <Text className='text-red-500'>{String(error.message)}</Text>}
    </>
  );
}
