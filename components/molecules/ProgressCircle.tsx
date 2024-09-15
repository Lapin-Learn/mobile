import { Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

type ProgressCircleProps = {
  progress: number;
  size: number;
  thickness?: number;
  color?: string;
  endAngle?: number;
  textStyle?: {
    fontSize: number;
    color: string;
  };
  showsText?: boolean;
  lineCap?: 'round';
};
export function ProgressCircle({
  progress = 10,
  size = 160,
  thickness = 15,
  color = 'rgba(36, 112, 99, 1)',
  textStyle = {
    fontSize: 36,
    color: 'rgba(36, 112, 99, 1)',
  },
  lineCap = 'round',
}: ProgressCircleProps) {
  return (
    <AnimatedCircularProgress
      size={size}
      width={thickness}
      fill={progress}
      tintColor='#247063'
      backgroundColor='#CCCCCC'
      lineCap={lineCap}
      rotation={0}>
      {() => <Text style={{ color: color, fontSize: textStyle.fontSize, fontWeight: 'bold' }}>{progress}%</Text>}
    </AnimatedCircularProgress>
  );
}
