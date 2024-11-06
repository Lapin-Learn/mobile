import { useRef, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import Styles, { Colors } from '~/constants/GlobalStyles';

type FillInTheBlankInputProps = {
  index: number;
  field: ControllerRenderProps<
    {
      answer: string[];
    },
    'answer'
  >;
  onChange: (text: string, index: number, field: any) => void;
  answer: string;
  isCorrect: boolean | null;
};

const FillInTheBlankInput = ({ index, field, onChange, answer, isCorrect, ...rest }: FillInTheBlankInputProps) => {
  const { t } = useTranslation('question');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const hasText = Boolean(field.value[index]);

  const styleForBlank = {
    indexCircle: [
      styles.indexCircle,
      isCorrect === null
        ? hasText
          ? styles.indexCircleWithText
          : styles.indexCircleWithoutText
        : isCorrect === true
          ? styles.indexCircleWithCorrect
          : styles.indexCircleWithIncorrect,
    ],
    indexText: [
      styles.indexText,
      styles.text,
      isCorrect === null
        ? hasText
          ? styles.indexTextWithText
          : styles.indexTextWithoutText
        : isCorrect === true
          ? styles.indexTextWithCorrect
          : styles.indexTextWithIncorrect,
    ],
    inputBlank: [
      styles.input,
      styles.text,
      isCorrect === null
        ? [
            styles.inputWidth,
            isFocused
              ? hasText
                ? styles.inputFocusedWithText
                : styles.inputFocusedWithoutText
              : hasText
                ? styles.inputUnfocusedWithText
                : styles.inputUnfocusedWithoutText,
          ]
        : [styles.inputWidthWhenChecked, isCorrect ? styles.inputCorrect : styles.inputIncorrect],
    ],
    inputIncorrectCorrespondingCorrect: [
      styles.input,
      styles.text,
      isCorrect === null
        ? [
            isFocused
              ? hasText
                ? styles.inputFocusedWithText
                : styles.inputFocusedWithoutText
              : styles.inputUnfocusedWithoutText,
            styles.inputWidth,
          ]
        : [styles.inputWidthWhenChecked, styles.inputCorrect],
    ],
  };

  return (
    <View style={[styles.containerAlign, styles.container]}>
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            inputRef.current?.focus();
          }}>
          <View style={styleForBlank.indexCircle}>
            <Text style={styleForBlank.indexText}>{index + 1}</Text>
          </View>
        </Pressable>
        <TextInput
          {...rest}
          ref={inputRef}
          style={styleForBlank.inputBlank}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isCorrect === null ? t('fillInTheBlank.enterTheAnswer') : ''}
          placeholderTextColor={isFocused ? Colors.blue[600] : Colors.neutral[200]}
          textAlign='center'
          readOnly={isCorrect !== null}
          value={field.value[index]}
          onChangeText={(text) => onChange(text, index, field)}
        />
        {isCorrect === false && (
          <TextInput
            {...rest}
            style={styleForBlank.inputIncorrectCorrespondingCorrect}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            textAlign='center'
            readOnly={isCorrect !== null}
            multiline
            value={answer}
            onChangeText={(text) => onChange(text, index, field)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  containerAlign: {
    alignSelf: 'flex-start',
  },
  indexCircle: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Styles.fontSize.body,
  },
  indexCircleWithoutText: {
    ...Styles.backgroundColor.blue[100],
  },
  indexCircleWithText: {
    ...Styles.backgroundColor.blue[600],
  },
  indexCircleWithCorrect: {
    ...Styles.backgroundColor.green[400],
  },
  indexCircleWithIncorrect: {
    ...Styles.backgroundColor.red[400],
  },
  indexText: {
    textAlign: 'center',
    ...Styles.font.bold,
    ...Styles.fontSize.body,
  },
  indexTextWithText: {
    ...Styles.color.blue[50],
  },
  indexTextWithoutText: {
    ...Styles.color.blue[600],
  },
  indexTextWithCorrect: {
    ...Styles.color.green[50],
  },
  indexTextWithIncorrect: {
    ...Styles.color.red[50],
  },
  input: {
    borderBottomWidth: 1,
    textAlign: 'center',
    paddingTop: 1,
    ...Styles.font.normal,
  },
  inputWidth: {
    width: 140,
  },
  inputWidthWhenChecked: {
    width: 'auto',
  },
  inputFocusedWithText: {
    ...Styles.color.blue[600],
    borderBottomColor: Colors.blue[600],
  },
  inputFocusedWithoutText: {
    ...Styles.color.blue[600],
    borderBottomColor: Colors.blue[600],
  },
  inputUnfocusedWithText: {
    color: 'black',
    borderBottomColor: 'black',
  },
  inputUnfocusedWithoutText: {
    ...Styles.color.neutral[300],
    borderBottomColor: Colors.neutral[300],
  },
  inputCorrect: {
    ...Styles.color.green[600],
    borderBottomColor: Colors.green[600],
  },
  inputIncorrect: {
    ...Styles.color.red[600],
    borderBottomColor: Colors.red[600],
    textDecorationLine: 'line-through',
  },
});

export default FillInTheBlankInput;
