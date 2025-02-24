// components/molecules/useFormInput.ts
import DateTimePicker from '@react-native-community/datetimepicker';
import { subDays } from 'date-fns';
import { useState } from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, Text, TextInputProps, View } from 'react-native';

import CustomTextInput from '~/components/molecules/form-input/CustomTextInput';
import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';

type CustomDateInputProps<T = Record<string, string>> = TextInputProps & {
  props: UseControllerProps<T & FieldValues>;
  placeholder: string;
};

const CustomDateInput = <T,>({ props, placeholder, ...inputProps }: CustomDateInputProps<T>) => {
  const { field } = useController(props);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localValue, setLocalValue] = useState<Date | undefined>();
  const { t } = useTranslation('profile');

  const handleSelect = () => {
    field.onChange(localValue);
    setShowDatePicker(false);
  };

  return (
    <Pressable style={{ width: '100%' }} onPress={() => setShowDatePicker(true)}>
      <View pointerEvents='none'>
        <CustomTextInput
          style={inputProps.style}
          placeholder={placeholder}
          value={field.value ? new Date(field.value).toLocaleDateString('en-GB') : ''}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
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
                  borderBottomColor: Styles.color.border.color,
                  ...Styles.backgroundColor.background,
                }}>
                <Button style={{ width: 'auto' }} variant='link' size='md' onPress={handleSelect}>
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
                  value={field.value ? new Date(field.value) : subDays(new Date(), 1)}
                  mode='date'
                  display='spinner'
                  textColor='black'
                  themeVariant='light'
                  minimumDate={subDays(new Date(), 365 * 100)} // 100 years ago
                  maximumDate={subDays(new Date(), 1)} // yesterday
                  onChange={(_, selectedDate) => {
                    setLocalValue(selectedDate);
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
            minimumDate={subDays(new Date(), 365 * 100)} // 100 years ago
            maximumDate={subDays(new Date(), 1)} // yesterday
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
};

export default CustomDateInput;
