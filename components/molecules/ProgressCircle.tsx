import { Text, TextStyle } from 'react-native';
import { AnimatedCircularProgress, AnimatedCircularProgressProps } from 'react-native-circular-progress';

type ProgressCircleProps = Pick<AnimatedCircularProgressProps, 'duration' | 'size' | 'lineCap'> & {
  progress: number;
  thickness?: number;
  color?: string;
  endAngle?: number;
  textStyle?: TextStyle;
  showsText?: boolean;
};
export const ProgressCircle = ({
  duration = 2500,
  progress = 10,
  size = 160,
  thickness = 15,
  color = '#247063',
  textStyle = {
    fontSize: 36,
    color: '#247063',
  },
  lineCap = 'round',
}: ProgressCircleProps) => {
  const progressValue = progress > 100 ? 100 : progress;

  return (
    <AnimatedCircularProgress
      duration={duration}
      size={size}
      width={thickness}
      fill={progressValue}
      tintColor={color}
      backgroundColor='#CCCCCC'
      lineCap={lineCap}
      rotation={0}>
      {(currentFill: number) => <Text style={[{ fontWeight: 'bold' }, textStyle]}>{Math.round(currentFill)}%</Text>}
    </AnimatedCircularProgress>
  );
};
