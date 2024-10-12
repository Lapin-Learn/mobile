import { IMilestone } from '~/lib/types';

export type MilestoneProps = {
  current: IMilestone;
  handleNextMilestone: () => void;
};
