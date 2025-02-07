import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import Styles from '~/constants/GlobalStyles';

const INITIAL_THUMB_SIZE = 14;

export type ProgressProps = {
  position: number;
  duration: number;
};

export type SeekBarProps = {
  progress: ProgressProps;
  sound?: Audio.Sound;
};

export const SeekBar = ({ progress, sound }: SeekBarProps) => {
  const { position, duration } = progress;
  const isSliding = useRef(false);
  const offset = useSharedValue(0);
  const thumbPosition = useSharedValue(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (!isSliding.current && duration > 0) {
      const newOffset = (position / duration) * (barWidth - INITIAL_THUMB_SIZE / 2);
      offset.value = withTiming(newOffset, { duration: 0 });
      thumbPosition.value = newOffset;
    }
  }, [position]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isSliding.current = true;
    })
    .onChange((event) => {
      const newOffset = thumbPosition.value + event.translationX;
      if (newOffset >= 0 && newOffset <= barWidth - INITIAL_THUMB_SIZE) {
        offset.value = newOffset;
      } else if (newOffset < 0) {
        offset.value = 0;
      } else if (newOffset > barWidth - INITIAL_THUMB_SIZE) {
        offset.value = barWidth - INITIAL_THUMB_SIZE;
      }
    })
    .onEnd(() => {
      const newPosition = (offset.value / (barWidth - INITIAL_THUMB_SIZE)) * duration;

      runOnJS(seekFunc)(newPosition);

      isSliding.current = false;
    });

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      runOnJS(async () => {
        await sound?.pauseAsync();
      });
    })
    .onEnd((event) => {
      const tapX = event.x;
      const newOffset = Math.max(0, Math.min(barWidth - INITIAL_THUMB_SIZE, tapX));
      offset.value = withTiming(newOffset, { duration: 0 });
      thumbPosition.value = newOffset;
      const newPosition = (newOffset / (barWidth - INITIAL_THUMB_SIZE)) * duration;
      runOnJS(seekFunc)(newPosition);
    });

  async function seekFunc(seekTo: number) {
    await sound?.setPositionAsync(seekTo * 1000);
  }

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value - INITIAL_THUMB_SIZE / 2 }],
    };
  });

  const sliderStyle = useAnimatedStyle(() => {
    return {
      width: offset.value,
    };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setBarWidth(width);
  };

  return (
    <GestureHandlerRootView style={styles.root} onLayout={handleLayout}>
      <GestureDetector gesture={tapGesture}>
        <Animated.View style={styles.seekBar}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[thumbStyle, styles.seekbarThumb]} />
          </GestureDetector>
          <Animated.View style={[styles.seekBarCurrent, sliderStyle]} />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seekBar: {
    height: 8,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 999,
    position: 'relative',
    ...Styles.backgroundColor.neutral[100],
  },
  seekBarCurrent: {
    height: 8,
    position: 'absolute',
    borderRadius: 999,
    top: 0,
    left: 0,
    ...Styles.backgroundColor.orange[400],
  },
  seekbarThumb: {
    position: 'absolute',
    zIndex: 10,
    height: 14,
    width: 14,
    borderRadius: 999,
    borderWidth: 0.5,
    ...Styles.borderColor.neutral[300],
    ...Styles.backgroundColor.background,
  },
});
