import { create } from 'zustand';

import { RandomGiftTypeEnum } from '~/lib/enums';
import { IReward } from '~/lib/types';

type RewardState = {
  reward: IReward;
  state: 'receive' | 'activate';
};

type RewardActions = {
  setReward: (rewards: IReward) => void;
  setState: (state: 'receive' | 'activate') => void;
};

type RewardStore = RewardState & RewardActions;

export const useRewardStore = create<RewardStore>((set) => ({
  reward: {
    type: RandomGiftTypeEnum.CARROTS,
    value: 0,
  },
  state: 'receive',
  setReward: (reward: IReward) => set({ reward }),
  setState: (state: 'receive' | 'activate') => set({ state }),
}));
