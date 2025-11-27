import { create } from "zustand";

export type TimerState = {
  activeTaskId: string | null;
  startTime: number | null;

  startTimer: (taskId: string) => void;
  stopTimer: () => void;
};

export const useTimerStore = create<TimerState>((set) => ({
  activeTaskId: null,
  startTime: null,

  startTimer: (taskId) => set({ activeTaskId: taskId, startTime: Date.now() }),

  stopTimer: () => set({ activeTaskId: null, startTime: null }),
}));
