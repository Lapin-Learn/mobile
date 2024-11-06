import { ChevronsDown, ChevronsUp } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import Styles from '~/constants/GlobalStyles';

type ReadingContainerProps = {
  children: React.ReactNode;
};

const ScrollableReadingContainer = ({ children }: ReadingContainerProps) => {
  const [isTop, setIsTop] = useState(true);
  const [isBottom, setIsBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollViewHeight = useRef(new Animated.Value(280)).current;
  const screenHeight = Dimensions.get('window').height;
  const maxHeight = screenHeight * 0.6;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const top = contentOffset.y === 0;
    const bottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 1;
    setIsTop(top);
    setIsBottom(bottom);
    setIsScrollable(contentSize.height > layoutMeasurement.height);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const newHeight = Math.max(100, Math.min(280 + gestureState.dy, maxHeight));
        scrollViewHeight.setValue(newHeight);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <View style={{ position: 'relative' }}>
      <Animated.View style={{ height: scrollViewHeight }}>
        <ScrollView
          style={styles.scrollView}
          onScroll={handleScroll}
          scrollEnabled={isScrollable}
          scrollEventThrottle={16}
          onContentSizeChange={(_, contentHeight) => {
            setIsScrollable(contentHeight > 280);
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
      <View style={styles.dragHandlerContainer} {...panResponder.panHandlers}>
        <View style={styles.dragHandler} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowsContainer: {
    position: 'absolute',
    bottom: 24,
    right: 8,
    display: 'flex',
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
    display: 'flex',
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
