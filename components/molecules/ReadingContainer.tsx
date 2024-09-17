import { ScrollView, Text, View } from 'react-native';

import ContentText from './ContentText';

export default function ReadingContainer({ children }: { children: string }) {
  return (
    <ScrollView className='max-h-80 rounded-lg border-[1px] border-neutral-900 p-4'>
      <ContentText>{children}</ContentText>
    </ScrollView>
  );
}
