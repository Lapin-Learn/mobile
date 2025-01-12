import { router } from 'expo-router';
import { LucideMoveLeft, LucideProps } from 'lucide-react-native';
import { ForwardRefExoticComponent } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

import Styles from '~/constants/GlobalStyles';

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
    <View style={styles.container}>
      {noBar || (
        <View style={[styles.navBar, displayStyle === 'center' ? styles.justifyCenter : styles.justifyBetween]}>
          {displayStyle === 'center' ? (
            <>{headerLeftShown && onHeaderLeftPress ? onHeaderLeftPress() : <View style={styles.placeholder} />}</>
          ) : (
            <>
              {headerLeftShown &&
                (onHeaderLeftPress ? (
                  onHeaderLeftPress()
                ) : (
                  <Pressable
                    style={styles.iconContainer}
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
          {headerTitle && <Text style={styles.headerTitle}>{headerTitle}</Text>}

          {headerRightShown && onHeaderRightPress ? onHeaderRightPress() : <View style={styles.placeholder} />}
        </View>
      )}

      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
            {title}
          </Text>
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.05,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 24,
  },
  headerTitle: {
    color: 'black',
    ...Styles.font.bold,
    ...Styles.fontSize['title-4'],
  },
  placeholder: {
    width: 24,
    ...Styles.color.blue[500],
  },
  titleContainer: {
    width: 'auto',
    alignItems: 'flex-start',
  },
  title: {
    ...Styles.font.bold,
    ...Styles.fontSize['large-title'],
    ...Styles.color.orange[900],
  },
});
