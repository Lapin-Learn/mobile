import { StyleProp, StyleSheet, Text, TextStyle, View, ViewProps } from 'react-native';

import IconCarrot from '~/assets/images/carrot.svg';
import { formatNumber } from '~/lib/utils';

import { styles } from './styles';

type CarrotsProps = ViewProps & {
  carrots: number;
  size?: 'sm' | 'base' | 'md' | 'lg';
  textStyle?: StyleProp<TextStyle>;
};

const iconSize = {
  sm: {
    width: 20,
    height: 20,
  },
  base: {
    width: 24,
    height: 24,
  },
  md: {
    width: 28,
    height: 28,
  },
  lg: {
    width: 36,
    height: 36,
  },
};

const Carrots = ({ carrots, size = 'md', style, textStyle }: CarrotsProps) => {
  return (
    <View style={StyleSheet.flatten([styles.root, style])}>
      <IconCarrot {...iconSize[size]} />
      <Text style={StyleSheet.flatten([styles.text, textStyle])}>{formatNumber(carrots)}</Text>
    </View>
  );
};

export default Carrots;
