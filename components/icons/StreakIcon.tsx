import { SvgProps } from 'react-native-svg';

import StreakDefault from '~/assets/images/streaks/streak_default.svg';
import StreakDone from '~/assets/images/streaks/streak_done.svg';
import StreakMiss from '~/assets/images/streaks/streak_miss.svg';

type StreakIconProps = {
  variant: 'done' | 'miss' | 'neutral';
} & SvgProps;

export default function StreakIcon({ variant, ...props }: StreakIconProps) {
  switch (variant) {
    case 'done':
      return <StreakDone {...props} />;
    case 'miss':
      return <StreakMiss {...props} />;
    case 'neutral':
      return <StreakDefault {...props} />;
  }
}
