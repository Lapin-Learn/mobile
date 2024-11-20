import { StyleSheet, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import * as Slot from '../primitives/slot';
import { SlottableViewProps } from '../primitives/types';
import { TextClassContext } from './Text';

type BadgeProps = SlottableViewProps & {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
};

const Badge = ({ variant = 'default', asChild, style, ...props }: BadgeProps) => {
  const Component = asChild ? Slot.View : View;
  return (
    <TextClassContext.Provider value={badgeTextStyles[variant]}>
      <Component style={StyleSheet.flatten([badgeStyles.root, badgeStyles[variant], style])} {...props} />
    </TextClassContext.Provider>
  );
};

const badgeStyles = StyleSheet.create({
  root: {
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1,
    ...Styles.borderColor.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  default: {
    borderColor: 'transparent',
    backgroundColor: Styles.color.orange[50].color,
  },
  secondary: {
    borderColor: 'transparent',
    backgroundColor: Styles.color.secondary.color,
  },
  destructive: {
    borderColor: 'transparent',
    backgroundColor: Styles.color.destructive.color,
  },
  outline: {},
});

export const badgeTextStyles = StyleSheet.create({
  root: {
    ...Styles.font.bold,
    ...Styles.fontSize.subhead,
  },
  default: {
    ...Styles.color.orange[500],
  },
  secondary: {
    ...Styles.color.foreground,
  },
  destructive: {
    ...Styles.color.destructive,
  },
  outline: {
    ...Styles.color.foreground,
  },
});

export { Badge };
export type { BadgeProps };
