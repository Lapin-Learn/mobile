import { StyleSheet, View } from 'react-native';

import Styles from '~/constants/GlobalStyles';

import * as Slot from '../primitives/slot';
import { SlottableViewProps } from '../primitives/types';
import { TextClassContext } from './Text';

type BadgeProps = SlottableViewProps & {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'blue' | 'secondary';
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
    backgroundColor: Styles.color.orangeSecondary.color,
  },
  destructive: {
    borderColor: 'transparent',
    backgroundColor: Styles.color.destructive.color,
  },
  blue: {
    borderColor: 'transparent',
    backgroundColor: '#D8EFFF',
    color: Styles.color.blue[600].color,
  },
  outline: {},
});

export const badgeTextStyles = StyleSheet.create({
  root: {
    ...Styles.font.semibold,
    ...Styles.fontSize.subhead,
  },
  default: {
    ...Styles.color.orange[500],
  },
  destructive: {
    ...Styles.color.white,
  },
  outline: {
    ...Styles.color.foreground,
  },
  blue: {
    ...Styles.color.blue[600],
  },
  secondary: {
    ...Styles.color.orange[700],
  },
});
export { Badge };
export type { BadgeProps };
