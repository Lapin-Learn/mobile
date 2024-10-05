import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import { cn } from '~/lib/utils';

export interface PlatformViewProps {
  children: React.ReactNode;
  className?: string;
}
const PlatformView: React.FC<PlatformViewProps> = ({ children, className, ...props }) => {
  return (
    <SafeAreaView {...props} style={{ paddingTop: StatusBar.currentHeight }} className={cn('h-full', className)}>
      {children}
    </SafeAreaView>
  );
};

export default PlatformView;
