import { create } from "zustand";

export type TimerState = {
  isTimerShow: boolean;
  activeTaskId: string | null;
  startTime: number | null;
  timeToLog: {
    taskId: string;
    time: number;
  } | null;

  startTimer: (taskId: string) => void;
  stopTimer: () => void;
  setTimeToLog: (taskId: string, time: number) => void;
  clearActiveTaskId: () => void;
};

export const useTimerStore = create<TimerState>((set) => ({
  isTimerShow: false,
  activeTaskId: null,
  startTime: null,
  timeToLog: null,

  startTimer: (taskId) =>
    set({ activeTaskId: taskId, startTime: Date.now(), isTimerShow: true }),
  stopTimer: () => set({ isTimerShow: false, startTime: null }),
  setTimeToLog: (taskId, time) => set({ timeToLog: { taskId, time } }),
  clearActiveTaskId: () => set({ activeTaskId: null }),
}));
