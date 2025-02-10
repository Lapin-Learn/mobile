import { Pressable, StyleSheet, Text } from 'react-native';

import Styles from '~/constants/GlobalStyles';

type ChoiceButtonProps = {
  variant?: 'correct' | 'incorrect' | 'selected' | 'default';
  label: string;
  onLabelPress?: () => void;
};
const ChoiceButton = ({ variant, label, onLabelPress }: ChoiceButtonProps) => {
  return (
    <Pressable style={StyleSheet.flatten([buttonStyles.root, variant && buttonStyles[variant]])} onPress={onLabelPress}>
      <Text style={variant && textStyles[variant]}>{label}</Text>
    </Pressable>
  );
};

const textStyles = StyleSheet.create({
  correct: {
    ...Styles.font.normal,
    ...Styles.color.green[700],
  },
  incorrect: {
    ...Styles.color.red[700],
  },
  selected: {
    ...Styles.color.blue[900],
  },
  default: {},
});

const buttonStyles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 6,
  },
  selected: {
    ...Styles.backgroundColor.blue[50],
    ...Styles.borderColor.blue[600],
  },
  incorrect: {
    ...Styles.backgroundColor.red[50],
    ...Styles.borderColor.red[600],
  },
  correct: {
    ...Styles.backgroundColor.green[50],
    ...Styles.borderColor.green[600],
  },
  default: {
    ...Styles.borderColor.neutral[100],
  },
});

export default ChoiceButton;
