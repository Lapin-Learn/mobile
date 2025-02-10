import { Pressable, StyleSheet } from 'react-native';

import { Label } from '~/components/ui/Label';
import { RadioGroupItem } from '~/components/ui/RadioGroup';
import Styles from '~/constants/GlobalStyles';

type ChoiceRadioProps = {
  variant?: 'correct' | 'incorrect' | 'selected' | 'default';
  label: string;
  onLabelPress?: () => void;
};
const ChoiceRadio = ({ variant, label, onLabelPress }: ChoiceRadioProps) => {
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
  selected: {},
  default: {},
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

  selected: {},
  default: {},
});

const textStyles = StyleSheet.create({
  correct: {
    ...Styles.font.normal,
    ...Styles.color.green[400],
  },
  incorrect: {
    ...Styles.color.red[400],
  },

  selected: {},
  default: {},
});

const buttonStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 6,
  },

  selected: {},
  default: {},
});

export default ChoiceRadio;
