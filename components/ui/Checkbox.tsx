import Ionicons from '@expo/vector-icons/Ionicons';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import * as CheckboxPrimitive from '../primitives/checkbox';

type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  className?: string;
  checked?: boolean;
};

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ ...props }, ref) => {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        style={StyleSheet.flatten([checkboxStyles.root, props.checked && checkboxStyles.checked])}
        {...props}>
        <CheckboxPrimitive.Indicator style={checkboxStyles.indicator}>
          <Ionicons name='checkmark' size={20} color='black' />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const checkboxStyles = StyleSheet.create({
  root: {
    height: 40,
    width: 40,
    flexShrink: 0,
    borderRadius: 4,
    borderWidth: 2,
    ...Styles.borderColor.neutral[900],
  },
  checked: {
    ...Styles.borderColor.orange[500],
    ...Styles.backgroundColor.orange[50],
  },
  indicator: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { Checkbox };
