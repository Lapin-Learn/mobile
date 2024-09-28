import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

export interface PlatformViewProps {
  children: React.ReactNode;
  className?: string;
}
const PlatformView: React.FC<PlatformViewProps> = ({ children, className, ...props }) => {
  return (
    <SafeAreaView {...props} style={{ flex: 1, paddingTop: StatusBar.currentHeight }} className={className}>
      {children}
    </SafeAreaView>
  );
};

export default PlatformView;
