import { createContext, FC } from 'react';
import { SvgProps } from 'react-native-svg';

import DailyTestIcon from '~/assets/images/missions/daily-test.svg';
import OctoberIcon from '~/assets/images/missions/october.svg';

const MissionIconContext = createContext<SvgProps>({});

type MissionIconProps = SvgProps & {};
type IconMappingsProps = Record<string | number, FC<SvgProps>>;

const iconMappings = {
  month: {
    10: OctoberIcon,
  },
  daily: {
    collect_carrots: DailyTestIcon,
    exercise: DailyTestIcon,
    learn_a_new_skill: DailyTestIcon,
  },
  monthly: {
    take_a_new_course: DailyTestIcon,
    learn_a_new_language: DailyTestIcon,
    learn_a_new_skill: DailyTestIcon,
  },
};

const MissionIcon: FC<MissionIconProps> & {
  Month: typeof Month;
  Monthly: typeof Monthly;
  Daily: typeof Daily;
} = ({ ...props }) => {
  return <MissionIconContext.Provider value={props} />;
};

const createIconComponent = (mapping: IconMappingsProps) => {
  const IconComponent = ({ code, ...props }: { code: string | number } & SvgProps) => {
    const Icon = mapping[code];
    return Icon ? <Icon {...props} /> : null;
  };
  IconComponent.displayName = 'IconComponent';
  return IconComponent;
};

const Month = createIconComponent(iconMappings.month);
const Monthly = createIconComponent(iconMappings.monthly);
const Daily = createIconComponent(iconMappings.daily);

MissionIcon.Month = Month;
MissionIcon.Monthly = Monthly;
MissionIcon.Daily = Daily;

export default MissionIcon;
