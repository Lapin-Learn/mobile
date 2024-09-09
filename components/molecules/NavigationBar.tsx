import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { BackButton } from './BackButton';

export function NavigationBar({
  title,
  headerTitle,
  headerLeftShown = false,
  headerLeft,
  headerRightShown = false,
  headerRight,
}: {
  title?: string;
  headerTitle?: string;
  headerLeftShown?: boolean;
  headerLeft?: () => JSX.Element;
  headerRightShown?: boolean;
  headerRight?: () => JSX.Element;
}) {
  return (
    <View className='bg-background'>
      <View className='h-[54px] flex flex-row justify-between items-center pl-4 '>
        {headerLeftShown &&
          (headerLeft ? (
            headerLeft()
          ) : (
            <BackButton
              className='w-6'
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.dismiss();
                }
              }}
            />
          ))}

        {headerTitle && <Text className='text-black text-title-1 font-bold'>{headerTitle}</Text>}

        {headerRightShown && headerRight ? headerRight() : <View className='w-6' />}
      </View>
      {title && (
        <View className='w-full pl-4 items-start'>
          <Text className='text-orange-900 text-large-title font-bold'>{title}</Text>
        </View>
      )}
    </View>
  );
}
