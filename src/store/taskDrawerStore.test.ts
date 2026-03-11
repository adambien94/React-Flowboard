import { act } from "react";
import { useTaskDrawerStore, syncTaskDrawerWithUrl } from "./taskDrawerStore";

describe("taskDrawerStore", () => {
  beforeEach(() => {
    window.location.hash = "";
    window.history.replaceState({}, document.title, "/");

    const { openTaskDrawer, closeTaskDrawer, setActiveColId } =
      useTaskDrawerStore.getState();

    useTaskDrawerStore.setState(
      {
        isTaskDrawerOpen: false,
        activeCardId: null,
        activeColId: null,
        openTaskDrawer,
        closeTaskDrawer,
        setActiveColId,
      },
      true,
    );
  });

  it("opens drawer with card id and updates URL hash", () => {
    act(() => {
      useTaskDrawerStore.getState().openTaskDrawer("card-1");
    });

    const state = useTaskDrawerStore.getState();
    expect(state.isTaskDrawerOpen).toBe(true);
    expect(state.activeCardId).toBe("card-1");
    expect(window.location.hash).toBe("#edit=card-1");
  });

  it("opens drawer without card id without touching URL hash", () => {
    act(() => {
      useTaskDrawerStore.getState().openTaskDrawer();
    });

    const state = useTaskDrawerStore.getState();
    expect(state.isTaskDrawerOpen).toBe(true);
    expect(state.activeCardId).toBeNull();
    expect(window.location.hash).toBe("");
  });

  it("closes drawer and clears state and URL", () => {
    act(() => {
      useTaskDrawerStore.getState().openTaskDrawer("card-1");
    });

    const pushStateSpy = jest.spyOn(window.history, "pushState");

    act(() => {
      useTaskDrawerStore.getState().closeTaskDrawer();
    });

    const state = useTaskDrawerStore.getState();
    expect(state.isTaskDrawerOpen).toBe(false);
    expect(state.activeCardId).toBeNull();
    expect(pushStateSpy).toHaveBeenCalled();
    expect(window.location.hash).toBe("");
  });

  it("syncs drawer state from URL hash", () => {
    window.location.hash = "#edit=card-42";

    act(() => {
      syncTaskDrawerWithUrl();
    });

    const state = useTaskDrawerStore.getState();
    expect(state.isTaskDrawerOpen).toBe(true);
    expect(state.activeCardId).toBe("card-42");
  });

  it("syncs closed state when URL hash is empty", () => {
    window.location.hash = "";

    act(() => {
      syncTaskDrawerWithUrl();
    });

    const state = useTaskDrawerStore.getState();
    expect(state.isTaskDrawerOpen).toBe(false);
    expect(state.activeCardId).toBeNull();
  });
});

