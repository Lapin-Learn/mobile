import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { BackButton } from './BackButton';

export type NavigationBarProps = {
  title?: string;
  headerTitle?: string;
  headerLeftShown?: boolean;
  onHeaderLeftPress?: () => JSX.Element;
  headerRightShown?: boolean;
  onHeaderRightPress?: () => JSX.Element;
};

export function NavigationBar({
  title,
  headerTitle,
  headerLeftShown = false,
  onHeaderLeftPress,
  headerRightShown = false,
  onHeaderRightPress,
}: NavigationBarProps) {
  return (
    <View className='bg-background px-4'>
      <View className='flex h-[54px] flex-row items-center justify-between'>
        {headerLeftShown &&
          (onHeaderLeftPress ? (
            onHeaderLeftPress()
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

        {headerTitle && <Text className='text-title-1 font-bold text-black'>{headerTitle}</Text>}

        {headerRightShown && onHeaderRightPress ? onHeaderRightPress() : <View className='w-6' />}
      </View>
      {title && (
        <View className='w-full items-start pl-4'>
          <Text className='text-large-title font-bold text-orange-900'>{title}</Text>
        </View>
      )}
    </View>
  );
}
