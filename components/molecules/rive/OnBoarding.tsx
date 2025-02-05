import React, { FC, LegacyRef } from 'react';
import { ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Rive, { Fit, RiveRef } from 'rive-react-native';

type OnBoardingRiveProps = {
  ref?: LegacyRef<RiveRef>;
  url?: string;
  stateMachineName?: string;
  fallback: FC<SvgProps>;
  style?: ViewStyle;
};

export const OnBoardingRive = ({ ref, style, url, stateMachineName, fallback }: OnBoardingRiveProps) => {
  return url ? (
    <Rive ref={ref} url={url} stateMachineName={stateMachineName} style={style} fit={Fit.Contain} />
  ) : (
    React.createElement(fallback)
  );
};
