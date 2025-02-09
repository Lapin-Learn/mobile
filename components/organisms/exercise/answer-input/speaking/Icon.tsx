import { LucideProps } from 'lucide-react-native';
import { ReactNode } from 'react';

import { Button } from '~/components/ui/Button';
import Styles from '~/constants/GlobalStyles';

type IconComponentProps = {
  name?: string;
  children?: ReactNode;
  size?: number;
} & LucideProps;

export const IconComponent = ({ children, ...props }: IconComponentProps) => {
  return (
    <Button
      variant='ghost'
      style={[
        { width: null, padding: 20, borderRadius: 100, ...Styles.backgroundColor.orange[50] },
        props.color ? { ...Styles.backgroundColor.orange[500] } : {},
        props.style,
      ]}
      onPress={props.onPress}
      disabled={props.disabled}>
      {children}
    </Button>
  );
};
