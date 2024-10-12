import { IMilestone } from '~/lib/types';

export type MilestoneProps = {
  readonly current: IMilestone;
  readonly handleNextMilestone: () => void;
};
