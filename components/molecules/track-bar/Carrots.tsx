import { StyleProp, StyleSheet, Text, TextStyle, View, ViewProps } from 'react-native';

import IconCarrot from '~/assets/images/carrot.svg';
import Styles from '~/constants/GlobalStyles';
import { formatNumber } from '~/lib/utils';

import { styles } from './styles';

type CarrotsProps = ViewProps & {
  carrots: number;
  size?: 'sm' | 'base' | 'md' | 'lg';
  textStyle?: StyleProp<TextStyle>;
};

const Carrots = ({ carrots, size = 'md', style, textStyle }: CarrotsProps) => {
  return (
    <View style={StyleSheet.flatten([styles.root, style])}>
      <IconCarrot {...Styles.iconSize[size]} />
      <Text style={StyleSheet.flatten([styles.text, textStyle])}>{formatNumber(carrots)}</Text>
    </View>
  );
};

export default Carrots;
