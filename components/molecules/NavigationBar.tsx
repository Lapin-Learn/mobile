import { router } from 'expo-router';
import { LucideMoveLeft, LucideProps } from 'lucide-react-native';
import { ForwardRefExoticComponent } from 'react';
import { Pressable, Text, View } from 'react-native';

export type NavigationBarProps = {
  title?: string;
  headerTitle?: string;
  headerLeftShown?: boolean;
  onHeaderLeftPress?: () => JSX.Element;
  headerRightShown?: boolean;
  onHeaderRightPress?: () => JSX.Element;
  icon?: ForwardRefExoticComponent<LucideProps>;
};

export function NavigationBar({
  title,
  headerTitle,
  headerLeftShown = false,
  onHeaderLeftPress,
  headerRightShown = false,
  onHeaderRightPress,
  icon: Icon = LucideMoveLeft,
}: NavigationBarProps) {
  return (
    <View className='px-4'>
      <View className='flex h-11 flex-row items-center justify-between'>
        {headerLeftShown &&
          (onHeaderLeftPress ? (
            onHeaderLeftPress()
          ) : (
            <Pressable
              style={{ width: 24, height: 24 }}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.dismiss();
                }
              }}>
              <Icon color={'black'} />
            </Pressable>
          ))}

        {headerTitle && <Text className='text-title-4 font-bold text-black'>{headerTitle}</Text>}

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
