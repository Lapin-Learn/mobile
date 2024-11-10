import PropTypes from 'prop-types';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import * as LabelPrimitive from '../primitives/label';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Text>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Text>
>(({ onPress, onLongPress, onPressIn, onPressOut, style, ...props }, ref) => (
  <LabelPrimitive.Root
    style={styles.labelRoot}
    onPress={onPress}
    onLongPress={onLongPress}
    onPressIn={onPressIn}
    onPressOut={onPressOut}>
    <LabelPrimitive.Text
      ref={ref}
      style={[styles.labelText, props.disabled && styles.labelTextDisabled, style]}
      {...props}
    />
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

Label.propTypes = {
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disabled: PropTypes.bool,
};

export { Label };

const styles = StyleSheet.create({
  labelRoot: {},
  labelText: {
    ...Styles.fontSize.body,
    ...Styles.font.medium,
    ...Styles.color.neutral[900],
  },
  labelTextDisabled: {
    opacity: 0.7,
  },
});
