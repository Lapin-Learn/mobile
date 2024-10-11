import { create } from 'zustand';

import { IMilestone } from '~/lib/interfaces';

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
    const filteredMilestones = milestones.filter((milestone) => milestone.type !== 'band_score_question_type_up');
    set({ milestones: filteredMilestones });
  },
}));
