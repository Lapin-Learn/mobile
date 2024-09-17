import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';

type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const [progress, setProgress] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View className='h-2 grow rounded-2xl bg-neutral-100'>
      <Animated.View className='h-full w-1/3 rounded-2xl bg-orange-400' />
    </View>
  );
}
