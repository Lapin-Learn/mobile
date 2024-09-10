import { SkillEnum } from '~/lib/enums';

export type RegionProps = {
  name: SkillEnum;
  selected: boolean | null;
  onSelect: () => void;
};
