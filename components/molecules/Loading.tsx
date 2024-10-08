import { ActivityIndicator, View } from 'react-native';
export function Loading() {
  return (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size={50} color='#EE5D28' />
    </View>
  );
}
