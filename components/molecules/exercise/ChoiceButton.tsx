import { StyleSheet, Text } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import { Button, ButtonProps } from '../../ui/Button';

type ChoiceButtonProps = Omit<ButtonProps, 'variant'> & {
  variant?: 'default' | 'correct' | 'incorrect' | 'selected';
  label: string;
};
const ChoiceButton = ({ variant = 'default', label, ...props }: ChoiceButtonProps) => {
  return (
    <Button style={StyleSheet.flatten([buttonStyles.root, buttonStyles[variant]])} {...props}>
      <Text style={textStyle.root}>{label}</Text>
    </Button>
  );
};

const textStyle = StyleSheet.create({
  root: {
    textAlign: 'center',
    ...Styles.font.normal,
    ...Styles.fontSize.body,
    ...Styles.color.neutral[900],
  },
});

const buttonStyles = StyleSheet.create({
  root: {
    borderWidth: 2,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  default: {
    ...Styles.borderColor.neutral[100],
    ...Styles.backgroundColor.background,
  },
  correct: {
    ...Styles.borderColor.green[400],
    ...Styles.backgroundColor.green[50],
  },
  incorrect: {
    ...Styles.borderColor.red[400],
    ...Styles.backgroundColor.red[50],
  },
  selected: {
    ...Styles.borderColor.orange[500],
    ...Styles.backgroundColor.background,
  },
});

export default ChoiceButton;
