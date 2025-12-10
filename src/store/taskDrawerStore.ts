import { create } from "zustand";

type TaskDrawerStore = {
  isTaskDrawerOpen: boolean;
  activeCardId: string | null;
  activeColId: string | null;
  openTaskDrawer: (cardId?: string) => void;
  setActiveColId: (colId: string) => void;
  closeTaskDrawer: () => void;
};

const parseHash = () => {
  const hash = window.location.hash;
  if (!hash) return { isTaskDrawerOpen: false, activeCardId: null };

  const editMatch = hash.match(/#edit=(.+)/);

  if (editMatch) {
    return { isTaskDrawerOpen: true, activeCardId: editMatch[1] };
  }
  return { isTaskDrawerOpen: false, activeCardId: null };
};

export const useTaskDrawerStore = create<TaskDrawerStore>((set) => ({
  isTaskDrawerOpen: false,
  activeCardId: null,
  activeColId: null,

  setActiveColId: (colId) => {
    set({ activeColId: colId });
  },

  openTaskDrawer: (cardId?) => {
    if (cardId) {
      set({ isTaskDrawerOpen: true, activeCardId: cardId });
      window.location.hash = `#edit=${cardId}`;
    } else {
      set({ isTaskDrawerOpen: true });
    }
  },

  closeTaskDrawer: () => {
    set({ isTaskDrawerOpen: false, activeCardId: null });
    window.history.pushState("", document.title, window.location.pathname);
  },
}));

export const syncTaskDrawerWithUrl = () => {
  const state = parseHash();
  useTaskDrawerStore.setState(state);
};
