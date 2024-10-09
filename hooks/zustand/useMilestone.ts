import { create } from 'zustand';

import { IMilestone } from '~/lib/interfaces';

type MilestoneState = {
  milestones: IMilestone[];
};

type MilestoneActions = {
  setMilestones: (milestones: IMilestone[]) => void;
};

type MilestoneStore = MilestoneState & MilestoneActions;

export const useMilestone = create<MilestoneStore>((set, get) => ({
  milestones: [],
  setMilestones: (milestones: IMilestone[]) => set({ milestones }),
}));
