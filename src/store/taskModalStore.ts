import { create } from "zustand";

type TaskModalState = {
  isTaskModalOpen: boolean;
  activeCardId: string | null;
  openTaskModal: (cardId: string) => void;
  closeTaskModal: () => void;
};

const parseHash = () => {
  const hash = window.location.hash;
  if (!hash) return { isTaskModalOpen: false, activeCardId: null, mode: null };

  const viewMatch = hash.match(/#view=(.+)/);

  if (viewMatch) {
    return { isTaskModalOpen: true, activeCardId: viewMatch[1] };
  }
  return { isTaskModalOpen: false, activeCardId: null };
};

export const useTaskModalStore = create<TaskModalState>((set) => ({
  isTaskModalOpen: false,
  activeCardId: null,

  openTaskModal: (cardId) => {
    set({ isTaskModalOpen: true, activeCardId: cardId });
    window.location.hash = `#view=${cardId}`;
  },

  closeTaskModal: () => {
    set({ isTaskModalOpen: false, activeCardId: null });
    window.history.pushState("", document.title, window.location.pathname);
  },
}));

export const syncTaskModalWithUrl = () => {
  const state = parseHash();
  useTaskModalStore.setState(state);
};
