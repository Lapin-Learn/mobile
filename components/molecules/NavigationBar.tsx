import { router } from 'expo-router';
import { LucideMoveLeft, LucideProps } from 'lucide-react-native';
import { ForwardRefExoticComponent } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

import { cn } from '~/lib/utils';

export type NavigationBarProps = ViewProps & {
  noBar?: boolean;
  title?: string;
  headerTitle?: string;
  headerLeftShown?: boolean;
  onHeaderLeftPress?: () => JSX.Element;
  headerRightShown?: boolean;
  onHeaderRightPress?: () => JSX.Element;
  displayStyle?: 'center';
  icon?: ForwardRefExoticComponent<LucideProps>;
};

export const NavigationBar = ({
  noBar,
  title,
  headerTitle,
  headerLeftShown = false,
  onHeaderLeftPress,
  headerRightShown = false,
  onHeaderRightPress,
  icon: Icon = LucideMoveLeft,
  displayStyle,
  children,
}: NavigationBarProps) => {
  return (
    <View className='px-4'>
      {noBar || (
        <View
          className={cn(
            'flex h-11 flex-row items-center',
            (displayStyle === 'center' && 'justify-center') ?? 'justify-between'
          )}>
          {displayStyle === 'center' ? (
            <>{headerLeftShown && onHeaderLeftPress ? onHeaderLeftPress() : <View className='w-6 bg-blue-500' />}</>
          ) : (
            <>
              {headerLeftShown &&
                (onHeaderLeftPress ? (
                  onHeaderLeftPress()
                ) : (
                  <Pressable
                    className='w-6'
                    onPress={() => {
                      if (router.canGoBack()) {
                        router.back();
                      } else {
                        router.dismiss();
                      }
                    }}>
                    <Icon color='black' />
                  </Pressable>
                ))}
            </>
          )}
          {headerTitle && <Text className='font-ibold text-title-4 text-black'>{headerTitle}</Text>}

          {headerRightShown && onHeaderRightPress ? onHeaderRightPress() : <View className='w-6 bg-blue-500' />}

          <View />
        </View>
      )}

      {title && (
        <View className='w-full items-start'>
          <Text className='font-ibold text-large-title text-orange-900'>{title}</Text>
        </View>
      )}
      {children}
    </View>
  );
};
