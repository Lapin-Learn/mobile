import { Text } from 'react-native';

export default function ContentText({ children }: { children: string }) {
  return <Text className='mr-2 p-4 text-body leading-8'>{children}</Text>;
}
