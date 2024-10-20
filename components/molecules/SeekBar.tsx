import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import TrackPlayer, { useProgress } from 'react-native-track-player';

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
    <GestureHandlerRootView className='flex w-full grow items-center justify-center' onLayout={handleLayout}>
      <GestureDetector gesture={tapGesture}>
        <Animated.View className='h-2 w-full items-start justify-center overflow-hidden rounded-xl bg-neutral-100'>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[thumbStyle]} className='absolute z-10 h-3.5 w-3.5 rounded-full bg-background' />
          </GestureDetector>
          <Animated.View style={[sliderStyle]} className='h-2 rounded-xl bg-orange-400' />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
