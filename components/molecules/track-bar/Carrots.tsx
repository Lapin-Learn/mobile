import { Text, View } from 'react-native';

import IconCarrot from '~/assets/images/carrot.svg';
import { formatNumber } from '~/lib/utils';

import { styles } from './styles';

type CarrotsProps = {
  carrots: number;
};

const Carrots = ({ carrots }: CarrotsProps) => {
  return (
    <View style={styles.root}>
      <IconCarrot width={28} height={28} />
      <Text style={styles.text}>{formatNumber(carrots)}</Text>
    </View>
  );
};

export default Carrots;
