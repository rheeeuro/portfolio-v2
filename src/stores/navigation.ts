import { create } from 'zustand';
import type { View } from '@/lib/scene';
interface NavigationState {
  view: View;
  entered: boolean;
  ready: boolean;
  failed: boolean;
  transitioning: boolean;
  navigate: (view: View) => void;
  syncView: (view: View) => void;
  enter: () => void;
}
export const useNavigation = create<NavigationState>((set, get) => ({
  view: 'home',
  entered: false,
  ready: false,
  failed: false,
  transitioning: false,
  navigate: (view) => {
    if (typeof window !== 'undefined' && window.location.hash !== `#${view}`)
      window.history.pushState(null, '', `#${view}`);
    set({
      view,
      entered: true,
      transitioning: get().view === view ? get().transitioning : true,
    });
  },
  syncView: (view) =>
    set({
      view,
      transitioning: get().view === view ? get().transitioning : true,
    }),
  enter: () => set({ entered: true }),
}));
