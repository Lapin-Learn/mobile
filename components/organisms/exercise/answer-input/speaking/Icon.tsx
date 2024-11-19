import { LucideIcon, LucideProps } from 'lucide-react-native';
import { Pressable } from 'react-native';

import Styles from '~/constants/GlobalStyles';

type IconComponentProps = {
  name?: string;
  icon: LucideIcon;
  size?: number;
} & LucideProps;

export const IconComponent = ({ icon: Icon, size = 24, ...props }: IconComponentProps) => {
  return (
    <Pressable
      style={[
        { padding: 14, borderRadius: 100, ...Styles.backgroundColor.orange[50] },
        props.name === 'Send' && { paddingTop: 18, paddingRight: 16 },
        props.color ? { ...Styles.backgroundColor.orange[500] } : {},
      ]}
      onPress={props.onPress}>
      <Icon size={size} color={props.color ?? Styles.color.orange[500].color} />
    </Pressable>
  );
};
