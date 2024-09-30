import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import { FieldError, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Platform, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

import { cn } from '~/lib/utils';

import SelectInput from './SelectInput';

type ControllerInputMode = 'text' | 'datepicker' | 'select' | 'change-password';

type TextModeProps = {
  isPassword?: boolean;
  isEmail?: boolean;
};

type SelectModeProps = {
  defaultLabel?: string;
  options?: { value: string; label: string }[];
};

export type ControllerInputProps<T = Record<string, string>> = {
  props: UseControllerProps<T & FieldValues>;
  label: string;
  placeholder: string;
  error: FieldError | undefined;
  mode?: ControllerInputMode;
  isEditable?: boolean;
  className?: string;
};

const CustomTextInput = ({ className, ...props }: TextInputProps) => {
  return (
    <TextInput
      className={cn(
        'w-full rounded border border-neutral-200 bg-white p-3 text-subhead font-medium placeholder:text-neutral-700',
        className
      )}
      {...props}
    />
  );
};

export function ControllerInput<T>({
  props,
  label,
  placeholder,
  error,
  mode = 'text',
  isEditable = true,
  isPassword = false,
  isEmail = false,
  defaultLabel = '',
  options,
  className = '',
}: ControllerInputProps<T> & TextModeProps & SelectModeProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { field } = useController(props);
  const { t } = useTranslation('profile');

  const renderInput = () => {
    switch (mode) {
      case 'datepicker':
        return (
          <TouchableOpacity className='w-full' onPress={() => setShowDatePicker(true)}>
            <CustomTextInput
              className={className}
              placeholder={placeholder}
              value={field.value ? new Date(field.value).toLocaleDateString('en-GB') : ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={false}
              style={{ color: 'black' }}
            />
          </TouchableOpacity>
        );
      case 'select':
        return (
          <SelectInput
            defaultValue={{
              value: field.value,
              label: defaultLabel,
            }}
            onValueChange={(option) => field.onChange(option?.value)}
            options={options || []}
            placeholder={placeholder}
          />
        );
      case 'change-password':
        return (
          <View className='relative w-full'>
            <CustomTextInput
              className={className}
              placeholder={placeholder}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              editable={false}
              secureTextEntry={true}
              style={{ color: 'black' }}
            />
            <TouchableOpacity
              className='absolute right-3 top-1/2 -translate-y-1/2 transform'
              onPress={() => router.push('/edit-profile/change-password')}>
              <Text className='text-subhead text-orange-500'>{t('profile.change_password')}</Text>
            </TouchableOpacity>
          </View>
        );
      default: {
        return (
          <CustomTextInput
            className={className}
            placeholder={placeholder}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            editable={isEditable}
            secureTextEntry={isPassword}
            keyboardType={isEmail ? 'email-address' : 'default'}
          />
        );
      }
    }
  };

  return (
    <View className='w-full flex-col items-start justify-start gap-1'>
      <Text className='text-lg font-semibold text-neutral-900'>{label}</Text>
      <View className='flex w-full flex-row gap-x-1'>
        <View className='flex w-full grow flex-row items-center justify-center rounded-md'>{renderInput()}</View>
      </View>
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
      {error && <Text className='text-red-500'>{String(error.message)}</Text>}
    </View>
  );
}
