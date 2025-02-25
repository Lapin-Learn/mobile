import { create } from 'zustand';

import { IMilestone } from '~/lib/types';

type MilestoneState = {
  milestones: IMilestone[];
};

type MilestoneActions = {
  setMilestones: (milestones: IMilestone[]) => void;
};

type MilestoneStore = MilestoneState & MilestoneActions;

export const useMilestoneStore = create<MilestoneStore>((set) => ({
  milestones: [],
  setMilestones: (milestones: IMilestone[]) => {
    set({ milestones });
  },
}));
