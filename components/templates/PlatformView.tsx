import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';

import { cn } from '~/lib/utils';

export type PlatformViewProps = SafeAreaViewProps & {
  className?: string;
};
const PlatformView: React.FC<PlatformViewProps> = ({ children, className, style, ...props }) => {
  return (
    <SafeAreaView
      {...props}
      style={StyleSheet.flatten([{ paddingVertical: StatusBar.currentHeight }, style])}
      className={cn('h-full', className)}>
      {children}
    </SafeAreaView>
  );
};

export default PlatformView;
