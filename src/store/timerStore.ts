import { create } from "zustand";

export type TimerState = {
  activeTaskId: string | null;
  startTime: number | null;
  timeToLog: {
    taskId: string;
    time: string;
  } | null;

  startTimer: (taskId: string) => void;
  stopTimer: () => void;
  setTimeToLog: (taskId: string, time: number) => void;
};

export const useTimerStore = create<TimerState>((set) => ({
  activeTaskId: null,
  startTime: null,
  timeToLog: null,

  startTimer: (taskId) => set({ activeTaskId: taskId, startTime: Date.now() }),
  stopTimer: () => set({ activeTaskId: null, startTime: null }),

  setTimeToLog: (taskId, time) => set({ timeToLog: { taskId, time } }),
}));
