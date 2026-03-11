import { act } from "react";
import { useTaskModalStore, syncTaskModalWithUrl } from "./taskModalStore";

describe("taskModalStore", () => {
  beforeEach(() => {
    // reset URL between tests
    window.location.hash = "";
    window.history.replaceState({}, document.title, "/");
    useTaskModalStore.setState({
      isTaskModalOpen: false,
      activeCardId: null,
      openTaskModal: useTaskModalStore.getState().openTaskModal,
      closeTaskModal: useTaskModalStore.getState().closeTaskModal,
    });
  });

  it("opens the task modal and updates the URL hash", () => {
    act(() => {
      useTaskModalStore.getState().openTaskModal("card-123");
    });

    const state = useTaskModalStore.getState();
    expect(state.isTaskModalOpen).toBe(true);
    expect(state.activeCardId).toBe("card-123");
    expect(window.location.hash).toBe("#view=card-123");
  });

  it("closes the task modal and clears state and URL", () => {
    act(() => {
      useTaskModalStore.getState().openTaskModal("card-123");
    });

    const pushStateSpy = jest.spyOn(window.history, "pushState");

    act(() => {
      useTaskModalStore.getState().closeTaskModal();
    });

    const state = useTaskModalStore.getState();
    expect(state.isTaskModalOpen).toBe(false);
    expect(state.activeCardId).toBeNull();
    expect(pushStateSpy).toHaveBeenCalled();
    expect(window.location.hash).toBe("");
  });

  it("syncs state from URL hash when present", () => {
    window.location.hash = "#view=card-999";

    act(() => {
      syncTaskModalWithUrl();
    });

    const state = useTaskModalStore.getState();
    expect(state.isTaskModalOpen).toBe(true);
    expect(state.activeCardId).toBe("card-999");
  });

  it("syncs closed state when URL hash is empty", () => {
    window.location.hash = "";

    act(() => {
      syncTaskModalWithUrl();
    });

    const state = useTaskModalStore.getState();
    expect(state.isTaskModalOpen).toBe(false);
    expect(state.activeCardId).toBeNull();
  });
});

