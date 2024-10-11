import { ChevronsDown, ChevronsUp } from 'lucide-react-native';
import { useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native';

type ReadingContainerProps = {
  children: React.ReactNode;
};

export default function ScrollableReadingContainer({ children }: ReadingContainerProps) {
  const [isTop, setIsTop] = useState(true);
  const [isBottom, setIsBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const top = contentOffset.y === 0;
    const bottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 1;
    setIsTop(top);
    setIsBottom(bottom);
    setIsScrollable(contentSize.height > layoutMeasurement.height);
  };

  return (
    <View className='relative'>
      <ScrollView
        className='max-h-80 grow-0 rounded border border-neutral-900'
        onScroll={handleScroll}
        scrollEnabled={isScrollable}
        scrollEventThrottle={16}
        onContentSizeChange={(_, contentHeight) => {
          setIsScrollable(contentHeight > 280);
        }}>
        {children}
      </ScrollView>
      {isScrollable && (
        <View className='absolute bottom-2 right-1 flex flex-col items-center gap-2'>
          <ChevronsUp color={isTop ? '#cccccc' : '#5c5c5c'} />
          <ChevronsDown color={isBottom ? '#cccccc' : '#5c5c5c'} />
        </View>
      )}
    </View>
  );
}
