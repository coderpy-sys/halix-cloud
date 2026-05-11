import { create } from 'zustand';

type SidebarState = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set, get) => ({
  collapsed: false,
  toggle: () => set({ collapsed: !get().collapsed }),
  setCollapsed: (v) => set({ collapsed: v }),
}));
