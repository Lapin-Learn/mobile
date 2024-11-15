import { create } from 'zustand';

import { ItemCardProps } from '~/components/molecules/items/inventory/ItemCard';
import { ItemPriceCardProps } from '~/components/molecules/items/shop/ItemPriceCard';
import { ShopItemEnum } from '~/lib/enums';
import { IInventory } from '~/lib/types';

type ShopModal = (ItemPriceCardProps | ItemCardProps) & {
  type?: 'buy' | 'use';
} & Partial<Pick<IInventory, 'itemId'>>;

type ShopState = {
  isModalVisible: boolean;
  modalContent: ShopModal;
  isAffordable: boolean;
  carrot: number;
  currentView: 'shop' | 'inventory';
};

type ShopActions = {
  openModal: (content: ShopModal) => void;
  closeModal: () => void;
  onContinue: (handleFunc: () => void) => void;
  setCarrot: (carrot: number) => void;
  setCurrentView: (view: 'shop' | 'inventory') => void;
};

const initialModalContent = {
  id: '',
  itemId: '',
  name: ShopItemEnum.IDENTIFICATION,
  image: '',
  price: {},
  amount: 0,
  value: 0,
  type: 'buy' as const,
  onBuy: () => true,
};

export const useShopStore = create<ShopState & ShopActions>((set, get) => ({
  isModalVisible: false,
  modalContent: initialModalContent,
  isAffordable: true,
  carrot: 0,
  currentView: 'shop',
  openModal: (modalContent: ShopModal) => {
    const { carrot } = get();
    const isAffordable = 'value' in modalContent ? carrot >= modalContent.value : false;
    set({ isModalVisible: true, modalContent, isAffordable });
  },
  closeModal: () => set({ isModalVisible: false, modalContent: initialModalContent }),
  onContinue: (handleFunc: () => void) => handleFunc(),
  setCarrot: (carrot) => set({ carrot }),
  setCurrentView: (view) => set({ currentView: view }),
}));
