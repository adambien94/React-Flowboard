import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      isTimerShow: false,
      activeTaskId: null,
      startTime: null,
      timeToLog: null,
      startTimer: (taskId) =>
        set({ activeTaskId: taskId, startTime: Date.now(), isTimerShow: true }),
      stopTimer: () => set({ isTimerShow: false, startTime: null }),
      setTimeToLog: (taskId, time) => set({ timeToLog: { taskId, time } }),
      clearActiveTaskId: () => set({ activeTaskId: null }),
    }),
    {
      name: "timer-store",
      partialize: (s) => ({
        isTimerShow: s.isTimerShow,
        activeTaskId: s.activeTaskId,
        startTime: s.startTime,
        timeToLog: s.timeToLog,
      }),
    }
  )
);
