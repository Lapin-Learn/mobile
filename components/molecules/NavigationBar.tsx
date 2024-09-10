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
      <View className='h-[54px] flex flex-row justify-between items-center'>
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

        {headerTitle && <Text className='text-black text-title-1 font-bold'>{headerTitle}</Text>}

        {headerRightShown && onHeaderRightPress ? onHeaderRightPress() : <View className='w-6' />}
      </View>
      {title && (
        <View className='w-full pl-4 items-start'>
          <Text className='text-orange-900 text-large-title font-bold'>{title}</Text>
        </View>
      )}
    </View>
  );
}
