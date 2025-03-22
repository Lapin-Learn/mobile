import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  StyleProps,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import Styles from '~/constants/GlobalStyles';

import * as ProgressPrimitive from '../primitives/progress';

type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  label?: string;
  value?: number | null;
  indicatorStyle?: StyleProps;
};

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  // eslint-disable-next-line react/prop-types
  ({ style, label, value = 0, indicatorStyle = {}, ...props }, ref) => {
    return (
      <ProgressPrimitive.Root ref={ref} style={StyleSheet.flatten([progressStyles.root, style])} {...props}>
        <Indicator
          value={value}
          style={StyleSheet.flatten([
            indicatorStyle,
            (value ?? 0) < 50 && { backgroundColor: Styles.color.orange[300].color },
          ])}
        />
        <View style={progressStyles.view}>
          <Text
            style={StyleSheet.flatten([
              progressStyles.text,
              {
                color:
                  (value || value === 0) && value < 50
                    ? Styles.color.neutral[500].color
                    : Styles.color.neutral[50].color,
              },
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
    height: 12,
    overflow: 'hidden',
    flexGrow: 1,
    borderRadius: 999,
    backgroundColor: '#dbdbdb',
  },
  text: {
    ...Styles.font.medium,
    ...Styles.fontSize['caption-2'],
  },
  view: {
    position: 'absolute',

    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { Progress };

const Indicator = ({ value, style }: { value?: number | null; style: { [key: string]: string } }) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withSequence(
      withDelay(300, withTiming(0, { duration: 0 })),
      withSpring(value ?? 0, {
        damping: 15,
        stiffness: 100,
      })
    );
  }, [value]);

  const indicator = useAnimatedStyle(() => {
    return {
      width: `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
      height: '100%',
      transform: [{ scale: interpolate(progress.value, [0, value ?? 0], [0.95, 1]) }],
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
