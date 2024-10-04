// components/molecules/useFormInput.ts
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { FieldError, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { Platform, TextInputProps, TouchableOpacity } from 'react-native';

import CustomTextInput from '~/components/molecules/CustomTextInput';
import SelectInput from '~/components/molecules/SelectInput';

export type ControllerInputType = 'text' | 'email' | 'number' | 'date' | 'select';

export type FormInputProps<T = Record<string, string>> = {
  props: UseControllerProps<T & FieldValues>;
  label: string;
  placeholder: string;
  error: FieldError | undefined;
  type?: ControllerInputType;
  defaultLabel?: string;
  options?: { value: string; label: string }[];
};

export function useFormInput<T>({ props, label, placeholder, error, type, defaultLabel, options }: FormInputProps<T>) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { field } = useController(props);

  const renderInput = (inputProps: TextInputProps) => {
    switch (type) {
      case 'text':
        return <CustomTextInput placeholder={placeholder} {...inputProps} />;
      case 'number':
        return <CustomTextInput placeholder={placeholder} {...inputProps} keyboardType='numeric' />;
      case 'email':
        return <CustomTextInput placeholder={placeholder} {...inputProps} keyboardType='email-address' />;
      case 'date':
        return (
          <TouchableOpacity className='w-full' onPress={() => setShowDatePicker(true)}>
            <CustomTextInput
              className={inputProps.className}
              placeholder={placeholder}
              value={field.value ? new Date(field.value).toLocaleDateString('en-GB') : ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={false}
              style={{ color: 'black' }}
            />
            {showDatePicker && (
              <DateTimePicker
                value={field.value ? new Date(field.value) : new Date()}
                mode='date'
                display='spinner'
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || new Date();
                  setShowDatePicker(Platform.OS === 'ios');
                  field.onChange(currentDate);
                  if (Platform.OS !== 'ios') {
                    setShowDatePicker(false);
                  }
                }}
              />
            )}
          </TouchableOpacity>
        );
      case 'select':
        return (
          <SelectInput
            defaultValue={{
              value: field.value,
              label: defaultLabel || options?.find((option) => option.value === field.value)?.label || '',
            }}
            onValueChange={(option) => field.onChange(option?.value)}
            options={options || []}
            placeholder={placeholder}
          />
        );

      default:
        return <CustomTextInput placeholder={placeholder} {...inputProps} />;
    }
  };

  return { renderInput, label, error, field, placeholder };
}
