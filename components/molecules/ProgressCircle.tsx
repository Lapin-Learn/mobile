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
export const ProgressCircle = ({
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
      duration={2500}
      size={size}
      width={thickness}
      fill={progressValue}
      tintColor={color}
      backgroundColor='#CCCCCC'
      lineCap={lineCap}
      rotation={0}>
      {(currentFill: number) => (
        <Text style={{ color: textStyle.color, fontSize: textStyle.fontSize, fontWeight: 'bold' }}>
          {Math.round(currentFill)}%
        </Text>
      )}
    </AnimatedCircularProgress>
  );
};
