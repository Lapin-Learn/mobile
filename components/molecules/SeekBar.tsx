import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import TrackPlayer, { useProgress } from 'react-native-track-player';

import Styles from '~/constants/GlobalStyles';

const INITIAL_THUMB_SIZE = 14;

export const SeekBar = ({ progress }: { progress: ReturnType<typeof useProgress> }) => {
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
  }, [position, duration, offset, thumbPosition]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isSliding.current = true;
      runOnJS(TrackPlayer.pause)();
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
      runOnJS(TrackPlayer.seekTo)(newPosition);
      runOnJS(TrackPlayer.play)();
      isSliding.current = false;
    });

  const tapGesture = Gesture.Tap().onEnd((event) => {
    const tapX = event.x;
    const newOffset = Math.max(0, Math.min(barWidth - INITIAL_THUMB_SIZE, tapX));
    offset.value = withTiming(newOffset, { duration: 0 });
    thumbPosition.value = newOffset;
    const newPosition = (newOffset / (barWidth - INITIAL_THUMB_SIZE)) * duration;
    runOnJS(TrackPlayer.seekTo)(newPosition);
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const sliderStyle = useAnimatedStyle(() => {
    return {
      width: offset.value + INITIAL_THUMB_SIZE / 2,
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
    overflow: 'hidden',
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
    ...Styles.backgroundColor.background,
  },
});
