import { Text } from 'react-native';

export default function ContentText({ children }: { children: string }) {
  return <Text className='text-body leading-8 p-4 mr-2'>{children}</Text>;
}
