import { Text, TextProps } from 'react-native';

import { cn } from '~/lib/utils';

type ContentTextProps = TextProps;

export default function ContentText({ children, ...props }: ContentTextProps) {
  return (
    <Text {...props} className={cn('p-4 text-body leading-8', props.className)}>
      {children}
    </Text>
  );
}
