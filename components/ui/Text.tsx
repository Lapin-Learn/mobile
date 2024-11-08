import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

import Styles from '~/constants/GlobalStyles';
type TextProps = RNTextProps & {
  asChild?: boolean;
};

const TextClassContext = React.createContext<
  | {
      [key: string]: any;
    }
  | undefined
>(undefined);

const Text = React.forwardRef<RNText, TextProps>(({ ...props }, ref) => {
  const textClass = React.useContext(TextClassContext); // Extract the class from the context
  const Component = RNText;
  return <Component style={StyleSheet.flatten([styles.root, textClass])} ref={ref} {...props} />;
});
Text.displayName = 'Text';

const styles = StyleSheet.create({
  root: {
    ...Styles.fontSize.body,
    color: '#1F1F1F',
  },
});
export { Text, TextClassContext };
