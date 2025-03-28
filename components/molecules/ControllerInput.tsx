import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInputProps, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';
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
  required = false,
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
  const { t } = useTranslation('validation');
  const [key, max] = (error?.message ?? '').split('|');

  return (
    <View style={styles.container}>
      <Text style={StyleSheet.flatten([Styles.font.semibold, Styles.color.neutral[900], styles.label])}>
        {label}
        {required && (
          <Text
            style={{
              ...Styles.font.semibold,
              ...Styles.color.red[500],
            }}>
            *
          </Text>
        )}
      </Text>
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
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
      {error && (
        <Text style={Styles.color.red[500]}>
          {t(error.type === 'invalid_type' ? 'required' : key, { name: label, max })}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 4,
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    gap: 4,
  },
  inputContainer: {
    width: '100%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  label: { ...Styles.fontSize.subhead, ...Styles.color.neutral[900] },
});
