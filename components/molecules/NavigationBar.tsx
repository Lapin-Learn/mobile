import { router } from 'expo-router';
import { LucideMoveLeft } from 'lucide-react-native';
import { Text, View } from 'react-native';

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
    <View className='px-4'>
      <View className='flex h-13.5 flex-row items-center justify-between'>
        {headerLeftShown &&
          (onHeaderLeftPress ? (
            onHeaderLeftPress()
          ) : (
            <LucideMoveLeft
              color={'black'}
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
        <View className='w-full items-start'>
          <Text className='text-large-title font-bold text-orange-900'>{title}</Text>
        </View>
      )}
    </View>
  );
}
