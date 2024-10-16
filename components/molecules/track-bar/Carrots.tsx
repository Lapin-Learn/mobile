import { Text, View } from 'react-native';

import IconCarrot from '~/assets/images/carrot.svg';
import { formatNumber } from '~/lib/utils';

type CarrotsProps = {
  carrots: number;
};

const Carrots = ({ carrots }: CarrotsProps) => {
  return (
    <View className='flex flex-row items-center justify-center gap-[2px]'>
      <IconCarrot width={28} height={28} />
      <Text className='title-4 font-bold text-orange-400'>{formatNumber(carrots)}</Text>
    </View>
  );
};

export default Carrots;
