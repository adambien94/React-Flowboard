import { create } from "zustand";

type TaskDrawerStore = {
  isTaskDrawerOpen: boolean;
  activeCardId: string | null;
  openTaskDrawer: (cardId?: string) => void;
  closeTaskDrawer: () => void;
};

const parseHash = () => {
  const hash = window.location.hash;
  if (!hash) return { isTaskDrawerOpen: false, activeCardId: null, mode: null };

  const editMatch = hash.match(/#edit=(.+)/);

  if (editMatch) {
    return { isTaskDrawerOpen: true, activeCardId: editMatch[1] };
  }
  return { isTaskDrawerOpen: false, activeCardId: null };
};

export const useTaskDrawerStore = create<TaskDrawerStore>((set) => ({
  isTaskDrawerOpen: false,
  activeCardId: null,

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
