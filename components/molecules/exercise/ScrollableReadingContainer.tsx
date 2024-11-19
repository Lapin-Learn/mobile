import { ChevronsDown, ChevronsUp } from 'lucide-react-native';
import { useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import Styles from '~/constants/GlobalStyles';

type ReadingContainerProps = {
  children: React.ReactNode;
};

const ScrollableReadingContainer = ({ children }: ReadingContainerProps) => {
  const [isTop, setIsTop] = useState(true);
  const [isBottom, setIsBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const minHeight = screenHeight * 0.1;
  const maxHeight = screenHeight * 0.6;
  const defaultHeight = 280;
  const scrollViewHeight = useSharedValue(defaultHeight);
  const contentHeightRef = useSharedValue(0);
  const panOffset = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const top = contentOffset.y === 0;
    const bottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 1;
    setIsTop(top);
    setIsBottom(bottom);
    setIsScrollable(contentSize.height > layoutMeasurement.height);
  };

  const updateScrollable = (newHeight: number) => {
    setIsScrollable(newHeight < contentHeightRef.value);
  };

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
      runOnJS(updateScrollable)(finalHeight);
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
        <ScrollView
          style={styles.scrollView}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(_, contentHeight) => {
            contentHeightRef.value = contentHeight;
            const initialHeight = Math.min(defaultHeight, contentHeight);
            scrollViewHeight.value = initialHeight;
            setIsScrollable(contentHeight > initialHeight);
          }}>
          {children}
        </ScrollView>
      </Animated.View>
      {isScrollable && (
        <View style={styles.arrowsContainer}>
          <ChevronsUp color={isTop ? '#cccccc' : '#5c5c5c'} />
          <ChevronsDown color={isBottom ? '#cccccc' : '#5c5c5c'} />
        </View>
      )}
      <GestureDetector gesture={pan}>
        <Animated.View style={styles.dragHandlerContainer}>
          <View style={styles.dragHandler} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowsContainer: {
    position: 'absolute',
    bottom: 24,
    right: 8,

    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  scrollView: {
    flexGrow: 0,
    paddingHorizontal: 16,
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
