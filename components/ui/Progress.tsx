import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';

import Styles from '~/constants/GlobalStyles';

import * as ProgressPrimitive from '../primitives/progress';

type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  className?: string;
  label?: string;
  value?: number | null;
  indicatorClassName?: string;
  indicatorStyle?: {
    [key: string]: string;
  };
};

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  // eslint-disable-next-line react/prop-types
  ({ style, label, value, indicatorStyle = {}, ...props }, ref) => {
    return (
      <ProgressPrimitive.Root ref={ref} style={StyleSheet.flatten([progressStyles.root, style])} {...props}>
        <Indicator value={value} style={indicatorStyle} />
        <View style={progressStyles.view}>
          <Text
            style={StyleSheet.flatten([
              progressStyles.text,
              { color: value && value < 50 ? Styles.color.neutral[500].color : Styles.color.neutral[50].color },
            ])}>
            {label}
          </Text>
        </View>
      </ProgressPrimitive.Root>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

const progressStyles = StyleSheet.create({
  root: {
    position: 'relative',
    height: 8,
    overflow: 'hidden',
    flexGrow: 1,
    borderRadius: 999,
    backgroundColor: Styles.color.neutral[100].color,
  },
  text: {
    ...Styles.font.medium,
    ...Styles.fontSize['caption-2'],
  },
  view: {
    position: 'absolute',
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { Progress };

const Indicator = ({ value, style }: { value?: number | null; style: { [key: string]: string } }) => {
  const progress = useDerivedValue(() => value ?? 0);

  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(`${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`, {
        overshootClamping: true,
      }),
      height: '100%',
      ...Styles.backgroundColor.orange[500],
      ...style,
    };
  });

  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View style={indicator} />
    </ProgressPrimitive.Indicator>
  );
};
