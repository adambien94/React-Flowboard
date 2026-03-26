import { create } from "zustand";

type UiState = {
  isCreateBoardModalOpen: boolean;
  openCreateBoardModal: () => void;
  closeCreateBoardModal: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  isCreateBoardModalOpen: false,
  openCreateBoardModal: () => set({ isCreateBoardModalOpen: true }),
  closeCreateBoardModal: () => set({ isCreateBoardModalOpen: false }),
}));
