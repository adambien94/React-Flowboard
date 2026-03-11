import { useTimerStore } from "./timerStore";

describe("timerStore", () => {
  const initialState = useTimerStore.getState();

  beforeEach(() => {
    useTimerStore.setState(initialState, true);
    localStorage.clear();
  });

  it("starts timer with given task id", () => {
    const before = Date.now();

    useTimerStore.getState().startTimer("card-1");

    const state = useTimerStore.getState();
    expect(state.activeTaskId).toBe("card-1");
    expect(state.isTimerShow).toBe(true);
    expect(state.startTime).not.toBeNull();
    expect(state.startTime as number).toBeGreaterThanOrEqual(before);
  });

  it("stops timer", () => {
    useTimerStore.getState().startTimer("card-1");
    useTimerStore.getState().stopTimer();

    const state = useTimerStore.getState();
    expect(state.isTimerShow).toBe(false);
    expect(state.startTime).toBeNull();
  });

  it("sets timeToLog and clears activeTaskId", () => {
    useTimerStore.getState().startTimer("card-1");
    useTimerStore.getState().setTimeToLog("card-1", 1234);
    useTimerStore.getState().clearActiveTaskId();

    const state = useTimerStore.getState();
    expect(state.timeToLog).toEqual({ taskId: "card-1", time: 1234 });
    expect(state.activeTaskId).toBeNull();
  });
});

