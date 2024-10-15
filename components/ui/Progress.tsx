import * as React from 'react';
import { Platform, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';

import { cn } from '~/lib/utils';

import * as ProgressPrimitive from '../primitives/progress';

type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  className?: string;
  label?: string;
  value?: number | null;
  indicatorClassName?: string;
};

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, label, value, indicatorClassName, ...props }, ref) => {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn('relative h-2 grow overflow-hidden rounded-full bg-neutral-100', className)}
        {...props}>
        <Indicator value={value} className={indicatorClassName} />
        <View className='absolute inset-0 flex h-full w-full items-center justify-center'>
          <Text
            className={`font-imedium text-caption-2 ${value && value < 50 ? 'text-neutral-500' : 'text-orange-50'}`}>
            {label}
          </Text>
        </View>
      </ProgressPrimitive.Root>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

const Indicator = ({ value, className }: { value?: number | null; className?: string }) => {
  const progress = useDerivedValue(() => value ?? 0);

  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(`${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`, {
        overshootClamping: true,
      }),
    };
  });

  if (Platform.OS === 'web') {
    return (
      <ProgressPrimitive.Indicator
        className={cn('h-full w-full flex-1 bg-primary web:transition-all', className)}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    );
  }

  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View style={indicator} className={cn('h-full bg-primary', className)} />
    </ProgressPrimitive.Indicator>
  );
};
