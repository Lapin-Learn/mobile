import { create } from 'zustand';

import { RandomGiftTypeEnum } from '~/lib/enums';
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
    type: RandomGiftTypeEnum.CARROTS,
    value: 0,
  },
  setReward: (reward: IReward) => set({ reward }),
}));
