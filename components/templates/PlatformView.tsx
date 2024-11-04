import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaViewProps } from 'react-native-safe-area-context';

const PlatformView: React.FC<SafeAreaViewProps> = ({ children, style, ...props }) => {
  return (
    <SafeAreaView
      {...props}
      style={StyleSheet.flatten([{ paddingVertical: StatusBar.currentHeight, height: '100%' }, style])}>
      {children}
    </SafeAreaView>
  );
};

export default PlatformView;
