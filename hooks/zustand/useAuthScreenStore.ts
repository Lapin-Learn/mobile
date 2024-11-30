import { create } from 'zustand';

export type AuthScreen = 'idle' | 'sign-in' | 'sign-up' | 'verify';

type AuthScreenState = {
  postScreen: AuthScreen;
};

type AuthScreenAction = {
  setPostScreen: (screen: AuthScreen) => void;
};

export const useAuthScreen = create<AuthScreenState & AuthScreenAction>((set) => ({
  postScreen: 'idle' as AuthScreen,
  setPostScreen: (screen) => set({ postScreen: screen }),
}));
