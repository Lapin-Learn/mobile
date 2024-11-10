import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import * as RadioGroupPrimitive from '../primitives/radio-group';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ ...props }, ref) => {
  return <RadioGroupPrimitive.Root style={styles.radioGroupRoot} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  indicatorStyle?: object;
}

const RadioGroupItem = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, RadioGroupItemProps>(
  ({ disabled, style, indicatorStyle, ...props }, ref) => {
    console.log('indicatorStyle', [styles.radioGroupIndicator, indicatorStyle]);
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        style={StyleSheet.flatten([
          {
            ...styles.radioGroupItem,
            ...(disabled && styles.radioGroupItemDisabled),
          },
          style,
        ])}
        {...props}>
        <RadioGroupPrimitive.Indicator style={styles.radioGroupIndicator}>
          <View style={[styles.radioGroupIndicatorView, indicatorStyle]} />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );
  }
);
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

const styles = StyleSheet.create({
  radioGroupRoot: {
    flexDirection: 'column',
    gap: 8,
  },
  radioGroupItem: {
    height: 16,
    width: 16,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    ...Styles.borderColor.neutral[900],
  },
  radioGroupItemDisabled: {
    opacity: 0.5,
  },
  radioGroupIndicator: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioGroupIndicatorView: {
    height: 10,
    width: 10,
    ...Styles.backgroundColor.neutral[900],
    borderRadius: 50,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
});
