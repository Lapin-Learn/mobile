import { Text, View } from 'react-native';

import IconCarrot from '~/assets/images/carrot.svg';
import { formatNumber } from '~/lib/utils';

import { styles } from './styles';

type CarrotsProps = {
  carrots: number;
  size?: 'sm' | 'md' | 'lg';
};

const iconSize = {
  sm: {
    width: 20,
    height: 20,
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

const Carrots = ({ carrots, size = 'md' }: CarrotsProps) => {
  return (
    <View style={styles.root}>
      <IconCarrot {...iconSize[size]} />
      <Text style={styles.text}>{formatNumber(carrots)}</Text>
    </View>
  );
};

export default Carrots;
