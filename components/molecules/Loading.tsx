import { ActivityIndicator, View } from 'react-native';
export function Loading() {
  return (
    <View className='flex-1 justify-center items-center'>
      <ActivityIndicator size={50} color='blue' />
    </View>
  );
}
