import { Pressable, StyleSheet } from 'react-native';

import { Label } from '~/components/ui/Label';
import { RadioGroupItem } from '~/components/ui/RadioGroup';
import Styles from '~/constants/GlobalStyles';

type ChoiceButtonProps = {
  variant?: 'correct' | 'incorrect';
  label: string;
  onLabelPress?: () => void;
};
const ChoiceButton = ({ variant, label, onLabelPress }: ChoiceButtonProps) => {
  return (
    <Pressable style={buttonStyles.root} onPress={onLabelPress}>
      <RadioGroupItem
        aria-labelledby={`label-for-${label}`}
        value={label}
        style={variant && radioStyles[variant]}
        indicatorStyle={variant && indicatorStyles[variant]}
      />
      <Label nativeID={`label-for-${label}`} onPress={onLabelPress} style={variant && textStyles[variant]}>
        {label}
      </Label>
    </Pressable>
  );
};

const radioStyles = StyleSheet.create({
  correct: {
    ...Styles.borderColor.green[400],
  },
  incorrect: {
    ...Styles.borderColor.red[400],
  },
});

const indicatorStyles = StyleSheet.create({
  correct: {
    ...Styles.backgroundColor.green[400],
    borderRadius: 50,
  },
  incorrect: {
    ...Styles.backgroundColor.red[500],
    borderRadius: 50,
  },
});

const textStyles = StyleSheet.create({
  correct: {
    ...Styles.font.normal,
    ...Styles.color.green[400],
  },
  incorrect: {
    ...Styles.color.red[400],
  },
});

const buttonStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 6,
  },
});

export default ChoiceButton;
