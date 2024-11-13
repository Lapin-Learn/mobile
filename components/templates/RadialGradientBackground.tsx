import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

type RadialGradientProps = {
  children?: React.ReactNode;
  colors?: [string, string]; // Array of two colors
  cx?: string; // Horizontal focal point (percentage)
  cy?: string; // Vertical focal point (percentage)
  rx?: string; // Horizontal radius (percentage)
  ry?: string; // Vertical radius (percentage)
  offsets?: [string, string]; // Offsets (percentage)
};

const RadialGradientBackground: React.FC<RadialGradientProps & Partial<ViewProps>> = ({
  children,
  colors = ['#FEFAF2', '#FFEFC6'], // Default colors based on your config
  cx = '50%', // Horizontal focal point
  cy = '24.89%', // Vertical focal point
  rx = '162.79%', // Horizontal radius
  ry = '75.11%', // Vertical radius
  style,
  offsets = ['0%', '100%'],
}) => {
  return (
    <View style={style}>
      <Svg height='100%' width='100%' style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id='grad' cx={cx} cy={cy} rx={rx} ry={ry} fx={cx} fy={cy} gradientUnits='userSpaceOnUse'>
            <Stop offset={offsets[0]} stopColor={colors[0]} stopOpacity='1' />
            <Stop offset={offsets[1]} stopColor={colors[1]} stopOpacity='1' />
          </RadialGradient>
        </Defs>
        <Rect x='0' y='0' width='100%' height='100%' fill='url(#grad)' />
      </Svg>
      {children}
    </View>
  );
};

export default RadialGradientBackground;
