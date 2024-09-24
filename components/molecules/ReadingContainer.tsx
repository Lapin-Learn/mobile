import { ChevronsDown, ChevronsUp } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import ContentText from './ContentText';

export default function ReadingContainer({ children }: { children: string }) {
  const [isTop, setIsTop] = useState(true);
  const [isBottom, setIsBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const handleScroll = (event: any) => {
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
        className='max-h-80 rounded border border-neutral-900'
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(contentWidth, contentHeight) => {
          setIsScrollable(contentHeight > 320);
        }}>
        <ContentText>{children}</ContentText>
      </ScrollView>
      {isScrollable && (
        <View className='absolute bottom-2 right-1 flex flex-col items-center'>
          <ChevronsUp color={isTop ? '#cccccc' : '#5c5c5c'} />
          <ChevronsDown color={isBottom ? '#cccccc' : '#5c5c5c'} />
        </View>
      )}
    </View>
  );
}
