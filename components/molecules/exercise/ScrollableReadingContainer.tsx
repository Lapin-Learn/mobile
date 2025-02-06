import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import Styles from '~/constants/GlobalStyles';

type ReadingContainerProps = {
  children: React.ReactNode;
};

const ScrollableReadingContainer = ({ children }: ReadingContainerProps) => {
  const screenHeight = Dimensions.get('window').height;
  const minHeight = screenHeight * 0.1;
  const maxHeight = screenHeight * 0.6;
  const defaultHeight = 280;
  const scrollViewHeight = useSharedValue(defaultHeight);
  const contentHeightRef = useSharedValue(0);
  const panOffset = useSharedValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const pan = Gesture.Pan()
    .onBegin(() => {
      panOffset.value = scrollViewHeight.value;
    })
    .onUpdate((event) => {
      const newHeight = Math.max(
        Math.min(minHeight, contentHeightRef.value),
        Math.min(panOffset.value + event.translationY, maxHeight)
      );
      scrollViewHeight.value = newHeight;
    })
    .onEnd(() => {
      const finalHeight = Math.max(
        Math.min(minHeight, contentHeightRef.value),
        Math.min(scrollViewHeight.value, maxHeight)
      );
      scrollViewHeight.value = finalHeight;
    });

  const animatedStyle = useAnimatedStyle(
    () => ({
      height: scrollViewHeight.value,
    }),
    [scrollViewHeight.value]
  );

  return (
    <View style={{ position: 'relative' }}>
      <Animated.View style={[animatedStyle]}>
        <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
          {children}
        </ScrollView>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.dragHandlerContainer, isDragging ? { backgroundColor: Styles.color.neutral[200].color } : {}]}
          onTouchStart={() => {
            setIsDragging(true);
          }}
          onTouchCancel={() => {
            setIsDragging(false);
          }}>
          <View style={styles.dragHandler} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    paddingHorizontal: 8,
  },
  dragHandlerContainer: {
    width: '100%',
    height: 12,
    marginVertical: 8,
    ...Styles.backgroundColor.neutral[100],
    opacity: 0.7,
  },
  dragHandler: {
    height: 4,
    width: 40,
    borderRadius: 2,
    backgroundColor: 'white',
    position: 'absolute',
    top: 4,
    left: '50%',
    transform: [{ translateX: -20 }],
  },
});

export default ScrollableReadingContainer;
