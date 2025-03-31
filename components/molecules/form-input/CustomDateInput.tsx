// components/molecules/useFormInput.ts
import DateTimePicker from '@react-native-community/datetimepicker';
import { subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';
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

  useEffect(() => {
    if (field.value) {
      setLocalValue(new Date(field.value));
    }
  }, [field.value]);

  const handleSelect = () => {
    if (localValue) {
      field.onChange(localValue);
      setShowDatePicker(false);
    }
  };

  const handleCancel = () => {
    setLocalValue(field.value ? new Date(field.value) : undefined);
    setShowDatePicker(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setLocalValue(selectedDate);
    }
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
          <Modal animationType='slide' transparent={true} visible={showDatePicker} onRequestClose={handleCancel}>
            <Pressable
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'flex-end',
              }}
              onPress={handleCancel}>
              <Pressable>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    paddingBottom: 20,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      padding: 4,
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
                      value={localValue || subDays(new Date(), 1)}
                      mode='date'
                      display='spinner'
                      textColor='black'
                      themeVariant='light'
                      minimumDate={subDays(new Date(), 365 * 100)} // 100 years ago
                      maximumDate={subDays(new Date(), 1)} // yesterday
                      onChange={handleDateChange}
                    />
                  </View>
                </View>
              </Pressable>
            </Pressable>
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
