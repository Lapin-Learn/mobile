import React, { FC, useEffect, useRef } from 'react';
import { ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Rive, { Fit, RiveRef } from 'rive-react-native';

type OnBoardingRiveProps = {
  url?: string;
  stateMachineName?: string;
  fallback: FC<SvgProps>;
  style?: ViewStyle;
  isPlaying?: boolean;
};

export const OnBoardingRive = ({ style, url, stateMachineName, fallback, isPlaying = false }: OnBoardingRiveProps) => {
  const riveRef = useRef<RiveRef>(null);

  useEffect(() => {
    if (isPlaying) {
      riveRef.current?.reset();
    } else {
      riveRef.current?.pause();
    }
  }, [isPlaying]);

  return url ? (
    <>
      <Rive url={url} stateMachineName={stateMachineName} style={style} fit={Fit.Contain} ref={riveRef} />
    </>
  ) : (
    React.createElement(fallback)
  );
};
