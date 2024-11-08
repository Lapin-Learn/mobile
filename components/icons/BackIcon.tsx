import { FC } from 'react';
import { Pressable, PressableProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

const IconPressable = ({ Icon, ...props }: { Icon: FC<SvgProps> } & PressableProps) => {
  return (
    <Pressable {...props}>
      <Icon width={32} height={32} />
    </Pressable>
  );
};

export default IconPressable;
