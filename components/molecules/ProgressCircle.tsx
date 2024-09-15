import * as Progress from 'react-native-progress';

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
  strokeCap?: 'round';
};
export function ProgressCircle({
  progress = 10,
  size = 160,
  thickness = 10,
  color = 'rgba(36, 112, 99, 1)',
  endAngle,
  textStyle,
  showsText = false,
  strokeCap = 'round',
}: ProgressCircleProps) {
  return (
    <Progress.Circle
      animated={false}
      textStyle={textStyle}
      showsText={showsText}
      thickness={thickness}
      size={size}
      progress={progress}
      strokeCap={strokeCap}
      endAngle={endAngle}
      color={color}
    />
  );
}
