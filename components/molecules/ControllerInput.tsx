import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInputProps, View } from 'react-native';

import { FormInputProps, useFormInput } from '~/hooks/useFormInput';
import { COLORS, FONTS, TEXTS } from '~/lib/constants';

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
    <View style={styles.container}>
      <Text style={StyleSheet.flatten([FONTS.semibold, TEXTS.large, { color: COLORS.neutral[900] }])}>{label}</Text>
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
      {error && <Text style={{ color: COLORS.red[500] }}>{t(String(error.message), { ns: 'validation' })}</Text>}
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
});
