import { SvgProps } from 'react-native-svg';

import Bronze from '~/assets/images/ranks/bronze.svg';
import Diamond from '~/assets/images/ranks/diamond.svg';
import Gold from '~/assets/images/ranks/gold.svg';
import Master from '~/assets/images/ranks/master.svg';
import Platinum from '~/assets/images/ranks/platinum.svg';
import Silver from '~/assets/images/ranks/silver.svg';
import { RankEnum } from '~/lib/enums';

type RankIconProps = {
  name: RankEnum;
} & SvgProps;

export default function RankIcon({ name, ...props }: RankIconProps) {
  switch (name) {
    case RankEnum.BRONZE:
      return <Bronze {...props} />;
    case RankEnum.SILVER:
      return <Silver {...props} />;
    case RankEnum.GOLD:
      return <Gold {...props} />;
    case RankEnum.PLATINUM:
      return <Platinum {...props} />;
    case RankEnum.DIAMOND:
      return <Diamond {...props} />;
    case RankEnum.MASTER:
      return <Master {...props} />;
  }
}
