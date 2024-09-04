import { forwardRef, Ref } from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const _BackButton = (props: SvgProps, ref: Ref<Svg>) => (
  <Svg {...props} width={24} height={24} viewBox='0 0 24 24' fill='none' ref={ref}>
    <Path d='M21 11H6.83L10.41 7.41L9 6L3 12L9 18L10.41 16.59L6.83 13H21V11Z' fill='black' />
  </Svg>
);
export const BackButton = forwardRef(_BackButton);
