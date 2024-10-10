// components/molecules/useFormInput.ts
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { FieldError, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Text, TextInputProps, TouchableOpacity, View } from 'react-native';

import CustomTextInput from '~/components/molecules/CustomTextInput';
import SelectInput from '~/components/molecules/SelectInput';
import { Button } from '~/components/ui/Button';

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
  const { t } = useTranslation('profile');

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
            />
            {showDatePicker &&
              (Platform.OS === 'ios' ? (
                <Modal animationType='none' transparent={true} visible={true}>
                  <View className='absolute bottom-0 left-0 right-0 w-full items-center justify-end bg-background'>
                    <View className='flex w-full items-end justify-center bg-white py-1'>
                      <Button variant={'link'} className='w-20' onPress={() => setShowDatePicker(false)}>
                        <Text className='text-title-4 text-blue-500'>{t('profile.done')}</Text>
                      </Button>
                    </View>
                    <View>
                      <DateTimePicker
                        value={field.value ? new Date(field.value) : new Date()}
                        mode='date'
                        display='spinner'
                        textColor='black'
                        themeVariant='light'
                        onChange={(_, selectedDate) => {
                          const currentDate = selectedDate || new Date();
                          setShowDatePicker(true);
                          field.onChange(currentDate);
                        }}
                      />
                    </View>
                  </View>
                </Modal>
              ) : (
                <DateTimePicker
                  value={field.value ? new Date(field.value) : new Date()}
                  mode='date'
                  display='spinner'
                  textColor='black'
                  onChange={(_, selectedDate) => {
                    const currentDate = selectedDate || new Date();
                    setShowDatePicker(Platform.OS === 'ios');
                    field.onChange(currentDate);
                    if (Platform.OS !== 'ios') {
                      setShowDatePicker(false);
                    }
                  }}
                />
              ))}
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
