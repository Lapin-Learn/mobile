import React, { FC } from 'react';
import { ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Rive, { Fit } from 'rive-react-native';

type OnBoardingRiveProps = {
  url?: string;
  stateMachineName?: string;
  fallback: FC<SvgProps>;
  style?: ViewStyle;
};

export const OnBoardingRive = ({ style, url, stateMachineName, fallback }: OnBoardingRiveProps) => {
  return url ? (
    <>
      <Rive url={url} stateMachineName={stateMachineName} style={style} fit={Fit.Contain} autoplay={true} />
    </>
  ) : (
    React.createElement(fallback)
  );
};
