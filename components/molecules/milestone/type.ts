import { IMilestone } from '~/lib/interfaces';

export type MilestoneProps = {
  readonly current: IMilestone;
  readonly handleNextMilestone: () => void;
};
