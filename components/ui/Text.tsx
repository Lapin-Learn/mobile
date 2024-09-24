import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { cn } from '~/lib/utils';
type TextProps = RNTextProps & {
  asChild?: boolean;
  className?: string;
};

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<RNText, TextProps>(({ asChild, className, ...props }, ref) => {
  const textClass = React.useContext(TextClassContext); // Extract the class from the context
  const Component = RNText;
  return <Component className={cn('text-body text-foreground', textClass, className)} ref={ref} {...props} />;
});
Text.displayName = 'Text';

export { Text, TextClassContext };
