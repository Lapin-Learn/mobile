import { Check } from 'lucide-react-native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import * as CheckboxPrimitive from '../../primitives/checkbox';

const choiceButtonStyles = StyleSheet.create({
  root: {
    height: 28,
    width: 28,
    flexShrink: 0,
    borderRadius: 4,
    borderWidth: 1,
  },
  default: {
    ...Styles.borderColor.neutral[200],
  },
  correct: {
    ...Styles.borderColor.green[400],
    ...Styles.color.green[50],
  },
  incorrect: {
    ...Styles.borderColor.red[400],
    ...Styles.color.red[50],
  },
  selected: {
    ...Styles.borderColor.orange[500],
    ...Styles.color.orange[50],
  },
});

type ChoiceCheckBoxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  label: string;
  checked?: boolean;
  variant?: 'default' | 'correct' | 'incorrect' | 'selected';
  onPress: () => void;
};

const ChoiceCheckBox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, ChoiceCheckBoxProps>(
  ({ variant = 'default', label, checked = false, onPress, ...props }, ref) => {
    return (
      <View style={styles.root}>
        <CheckboxPrimitive.Root
          ref={ref}
          style={StyleSheet.flatten([choiceButtonStyles.root, choiceButtonStyles[variant]])}
          checked={checked}
          onPress={onPress}
          {...props}>
          <CheckboxPrimitive.Indicator style={styles.indicator}>
            <Check size={20} color='black' />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <Text style={styles.text}>{label}</Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  root: {
    marginBottom: 12,
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    ...Styles.font.normal,
    ...Styles.fontSize.body,
    flexShrink: 1,
  },
  indicator: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

ChoiceCheckBox.displayName = CheckboxPrimitive.Root.displayName;

export { ChoiceCheckBox };
