import { create } from "zustand";
import type { Card } from "../types";

type TaskModalState = {
  isOpen: boolean;
  activeCardId: string | null;
  openModal: (cardId: string) => void;
  closeModal: () => void;
};

const parseHash = () => {
  const hash = window.location.hash;
  if (!hash) return { isOpen: false, activeCardId: null, mode: null };

  const viewMatch = hash.match(/#view=(.+)/);

  if (viewMatch) {
    return { isOpen: true, activeCardId: viewMatch[1] };
  }
  return { isOpen: false, activeCardId: null };
};

export const useTaskModalStore = create<TaskModalState>((set) => ({
  isOpen: false,
  activeCardId: null,
  mode: null,

  openModal: (cardId) => {
    set({ isOpen: true, activeCardId: cardId });
    window.location.hash = `#view=${cardId}`;
  },

  closeModal: () => {
    set({ isOpen: false, activeCardId: null });
    window.history.pushState("", document.title, window.location.pathname);
  },
}));

// Export funkcji do synchronizacji (używaj poza store)
export const syncTaskModalWithUrl = () => {
  const state = parseHash();
  useTaskModalStore.setState(state);
};
