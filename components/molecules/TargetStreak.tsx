import Svg, { Defs, LinearGradient, Path, Stop, SvgProps } from 'react-native-svg';

type TargetStreakProps = {
  active: boolean;
};
export const TargetStreak = ({ active, ...props }: TargetStreakProps & SvgProps) => (
  <Svg {...props} fill='none'>
    <Path
      fill='#fff'
      d='M31 1.963a12 12 0 0 1 12 0l24.373 14.072a12 12 0 0 1 6 10.392v28.144a12 12 0 0 1-6 10.392L43 79.035a12 12 0 0 1-12 0L6.627 64.963a12 12 0 0 1-6-10.392V26.427a12 12 0 0 1 6-10.392L31 1.963Z'
    />
    <Path
      fill='url(#a)'
      d='M31 7.325a12 12 0 0 1 12 0l19.73 11.39a12 12 0 0 1 6 10.393V51.89a12 12 0 0 1-6 10.392L43 73.673a12 12 0 0 1-12 0l-19.73-11.39a12 12 0 0 1-6-10.393V29.108a12 12 0 0 1 6-10.392L31 7.325Z'
    />
    <Defs>
      {active ? (
        <LinearGradient id='a' x1={21.808} x2={49.511} y1={10.563} y2={65.52} gradientUnits='userSpaceOnUse'>
          <Stop stopColor='#0086E0' />
          <Stop offset={1} stopColor='#74BEF0' />
        </LinearGradient>
      ) : (
        <LinearGradient id='a' x1={21.808} x2={49.511} y1={10.563} y2={65.52} gradientUnits='userSpaceOnUse'>
          <Stop stopColor='#9199A2' />
          <Stop offset={1} stopColor='#BBC2CC' />
        </LinearGradient>
      )}
    </Defs>
    {props.children}
  </Svg>
);
