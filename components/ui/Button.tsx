import * as React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { TextClassContext } from '~/components/ui/Text';
import Styles from '~/constants/GlobalStyles';

const buttonSizeStyles = StyleSheet.create({
  default: {
    width: '100%',
  },
  sm: {
    height: 28,
  },
  md: {
    height: 34,
  },
  lg: {
    height: 50,
  },
  icon: {
    width: 28,
    height: 28,
  },
});

const buttonStyles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 8,
  },
  default: {
    ...Styles.backgroundColor.orange[500],
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  destructive: {
    ...Styles.backgroundColor.destructive,
  },
  outline: {
    margin: 'auto',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    ...Styles.borderColor.border,
  },
  secondary: {
    ...Styles.backgroundColor.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  black: {
    ...Styles.backgroundColor.neutral[900],
  },
  disabled: {
    ...Styles.fontSize.body,
    ...Styles.font.semibold,
    opacity: 0.5,
  },
});

const buttonTextStyles = StyleSheet.create({
  root: {
    ...Styles.fontSize.body,
    ...Styles.font.semibold,
    ...Styles.color.foreground,
  },
  default: {
    ...Styles.color.white,
  },
  destructive: {
    ...Styles.color.white,
  },
  outline: {
    ...Styles.color.neutral[100],
  },
  secondary: {
    ...Styles.color.foreground,
  },
  ghost: {},
  link: {
    ...Styles.color.orange[500],
  },
  black: {
    ...Styles.color.white,
  },
});

const buttonTextSizeStyles = StyleSheet.create({
  default: {
    fontSize: 12,
  },
  sm: {
    fontSize: 12,
  },
  md: {
    fontSize: 16,
  },
  lg: {
    fontSize: 16,
  },
  icon: {
    fontSize: 16,
  },
});

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'black';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'md';
};

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  // eslint-disable-next-line react/prop-types
  ({ style, variant = 'default', size = 'default', disabled = false, ...props }, ref) => {
    return (
      <TextClassContext.Provider
        value={StyleSheet.flatten([buttonTextStyles.root, buttonTextStyles[variant], buttonTextSizeStyles[size]])}>
        <Pressable
          style={StyleSheet.flatten([
            buttonStyles.root,
            buttonStyles[variant],
            buttonSizeStyles[size],
            disabled && buttonStyles.disabled,
            style,
          ])}
          ref={ref}
          role='button'
          disabled={disabled}
          {...props}
        />
      </TextClassContext.Provider>
    );
  }
);
Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
