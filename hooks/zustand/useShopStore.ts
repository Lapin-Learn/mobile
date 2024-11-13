import { create } from 'zustand';

import { ItemCardProps } from '~/components/molecules/items/inventory/ItemCard';
import { ItemPriceCardProps } from '~/components/molecules/items/shop/ItemPriceCard';
import { ShopItemEnum } from '~/lib/enums';

type ShopModal = (ItemPriceCardProps | ItemCardProps) & {
  type?: 'buy' | 'use';
};

type ShopState = {
  isModalVisible: boolean;
  modalContent: ShopModal;
};

type ShopActions = {
  openModal: (content: ShopModal) => void;
  closeModal: () => void;
  onContinue: (handleFunc: () => void) => void;
};

const initialModalContent = {
  id: '',
  name: ShopItemEnum.IDENTIFICATION,
  image: '',
  price: {},
  amount: 0,
  value: 0,
  type: 'buy' as const,
  onBuy: () => true,
};

export const useShopStore = create<ShopState & ShopActions>((set) => ({
  isModalVisible: false,
  modalContent: initialModalContent,
  openModal: (modalContent: ShopModal) => set({ isModalVisible: true, modalContent }),
  closeModal: () => set({ isModalVisible: false, modalContent: initialModalContent }),
  onContinue: (handleFunc: () => void) => {
    handleFunc();
    set({ isModalVisible: false });
  },
}));
