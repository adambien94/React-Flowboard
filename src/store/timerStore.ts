import { useEffect, useRef } from "react";
import { create } from "zustand";
import { useLocalStorage } from "../useLocalStorage";

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

type TimerPersistState = Pick<
  TimerState,
  "isTimerShow" | "activeTaskId" | "startTime" | "timeToLog"
>;

const TIMER_STORAGE_KEY = "timer-store";

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

export const usePersistentTimerStore = () => {
  const [storedState, setStoredState] = useLocalStorage<TimerPersistState>(
    TIMER_STORAGE_KEY,
    {
      isTimerShow: false,
      activeTaskId: null,
      startTime: null,
      timeToLog: null,
    }
  );

  const hasHydrated = useRef(false);
  useEffect(() => {
    if (hasHydrated.current) return;
    useTimerStore.setState(storedState);
    hasHydrated.current = true;
  }, [storedState]);

  useEffect(() => {
    const unsubscribe = useTimerStore.subscribe((state: TimerState) =>
      setStoredState({
        isTimerShow: state.isTimerShow,
        activeTaskId: state.activeTaskId,
        startTime: state.startTime,
        timeToLog: state.timeToLog,
      })
    );

    return unsubscribe;
  }, [setStoredState]);

  return useTimerStore();
};
