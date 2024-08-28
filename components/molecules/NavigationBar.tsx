import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { BackButton } from './BackButton';

export function NavigationBar({ title, headerLeftShown = false }: { title: string; headerLeftShown?: boolean }) {
  return (
    <View className='bg-background pt-[54px]'>
      <View className='h-[54px] flex justify-center items-start pl-4 '>
        {headerLeftShown && (
          <BackButton
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.dismiss();
              }
            }}
          />
        )}
      </View>
      <View className='w-full pl-4'>
        <Text className='text-orange-900 text-large-title font-bold'>{title}</Text>
      </View>
    </View>
  );
}
