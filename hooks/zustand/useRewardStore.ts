import { create } from 'zustand';

import { RandomGiftType } from '~/lib/enums';
import { IReward } from '~/lib/types';

type RewardState = {
  reward: IReward;
};

type RewardActions = {
  setReward: (rewards: IReward) => void;
};

type RewardStore = RewardState & RewardActions;

export const useRewardStore = create<RewardStore>((set) => ({
  reward: {
    type: RandomGiftType.CARROTS,
    value: 0,
  },
  setReward: (reward: IReward) => set({ reward }),
}));
