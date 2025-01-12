// components/molecules/useFormInput.ts
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { FieldError, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, Text, TextInputProps, View } from 'react-native';

import SelectInput from '~/components/molecules//form-input/SelectInput';
import CustomTextInput from '~/components/molecules/form-input/CustomTextInput';
import PasswordInput from '~/components/molecules/form-input/PasswordInput';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';

export type ControllerInputType = 'text' | 'email' | 'number' | 'date' | 'select' | 'password';

export type FormInputProps<T = Record<string, string>> = {
  props: UseControllerProps<T & FieldValues>;
  label: string;
  placeholder: string;
  error: FieldError | undefined;
  type?: ControllerInputType;
  defaultLabel?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};

export const useFormInput = <T,>({
  props,
  label,
  placeholder,
  error,
  type,
  defaultLabel,
  options,
}: FormInputProps<T>) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { field } = useController(props);
  const { t } = useTranslation('profile');

  const renderInput = (inputProps: TextInputProps) => {
    switch (type) {
      case 'text':
        return <CustomTextInput placeholder={placeholder} {...inputProps} />;
      case 'password':
        return <PasswordInput placeholder={placeholder} {...inputProps} />;
      case 'number':
        return <CustomTextInput placeholder={placeholder} {...inputProps} keyboardType='numeric' />;
      case 'email':
        return <CustomTextInput placeholder={placeholder} {...inputProps} keyboardType='email-address' />;
      case 'date':
        return (
          <Pressable style={{ width: '100%' }} onPress={() => setShowDatePicker(true)}>
            <View pointerEvents='none'>
              <CustomTextInput
                style={inputProps.style}
                placeholder={placeholder}
                value={field.value ? new Date(field.value).toLocaleDateString('en-GB') : ''}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                editable={false}
              />
            </View>
            {showDatePicker &&
              (Platform.OS === 'ios' ? (
                <Modal animationType='none' transparent={true} visible={true}>
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      shadowColor: 'black',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      ...Styles.backgroundColor.background,
                    }}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row-reverse',
                        paddingVertical: 4,
                        borderBottomWidth: 1,
                        borderBottomColor: '#00000011',

                        ...Styles.backgroundColor.background,
                      }}>
                      <Button
                        style={{ width: 'auto' }}
                        variant='link'
                        size='md'
                        onPress={() => setShowDatePicker(false)}>
                        <Text
                          style={{
                            ...Styles.font.normal,
                            ...Styles.fontSize['title-4'],
                            ...Styles.color.blue[500],
                          }}>
                          {t('profile.done')}
                        </Text>
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
          </Pressable>
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
            style={inputProps.style}
          />
        );

      default:
        return <CustomTextInput placeholder={placeholder} {...inputProps} />;
    }
  };

  return { renderInput, label, error, field, placeholder };
};
