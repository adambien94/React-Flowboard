import { act } from "react";
import { useBoardStore } from "./useBoardStore";
import { supabase } from "../api/supabaseClient";

jest.mock("../api/supabaseClient", () => {
  const from = jest.fn();
  const channel = jest.fn();
  const rpc = jest.fn();
  const removeChannel = jest.fn();

  return {
    supabase: { from, channel, rpc, removeChannel },
  };
});

const mockedSupabase = supabase as unknown as {
  from: jest.Mock;
  channel: jest.Mock;
  rpc: jest.Mock;
  removeChannel: jest.Mock;
};

// Polyfill structuredClone for the Node/Jest environment
(globalThis as any).structuredClone =
  (globalThis as any).structuredClone ??
  ((value: unknown) => JSON.parse(JSON.stringify(value)));

describe("useBoardStore", () => {
  const initialState = useBoardStore.getState();

  beforeEach(() => {
    jest.clearAllMocks();
    useBoardStore.setState(initialState, true);
  });

  it("sets card details via setCardDetails", () => {
    const card = {
      id: "card-1",
      title: "Test",
      description: "Desc",
      priority: "low",
      position: 0,
      column_id: "col-1",
    };

    act(() => {
      useBoardStore.getState().setCardDetails(card as any);
    });

    expect(useBoardStore.getState().cardDetails).toEqual(card);
  });

  it("optimistically updates logged time via setLogTime and calls supabase rpc", async () => {
    mockedSupabase.rpc.mockResolvedValue({ error: null });

    useBoardStore.setState((state) => ({
      ...state,
      columns: [
        {
          id: "col-1",
          title: "Col",
          color: "green",
          position: 0,
          board_id: "board-1",
          cards: [
            {
              id: "card-1",
              title: "Task",
              description: "",
              priority: "low",
              position: 0,
              column_id: "col-1",
              logged_time: 10,
            },
          ],
        },
      ],
    }));

    await act(async () => {
      await useBoardStore.getState().setLogTime("card-1", 5);
    });

    const card = useBoardStore.getState().columns[0].cards[0];
    expect(card.logged_time).toBe(15);
    expect(mockedSupabase.rpc).toHaveBeenCalledWith("increment_logged_time", {
      card_id: "card-1",
      seconds: 5,
    });
  });

  it("adds a new column with correct position via addColumn", async () => {
    mockedSupabase.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: "col-2", title: "New", color: "blue", position: 1 },
            error: null,
          }),
        }),
      }),
    } as any);

    useBoardStore.setState((state) => ({
      ...state,
      columns: [
        {
          id: "col-1",
          title: "Existing",
          color: "green",
          position: 0,
          board_id: "board-1",
          cards: [],
        },
      ],
    }));

    await act(async () => {
      await useBoardStore.getState().addColumn("board-1", "New", "blue");
    });

    const { columns } = useBoardStore.getState();
    expect(columns).toHaveLength(2);
    expect(columns[1].id).toBe("col-2");
    expect(mockedSupabase.from).toHaveBeenCalledWith("columns");
  });

  it("reorders columns via moveColumn and persists order", async () => {
    const updateMock = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    mockedSupabase.from.mockReturnValue({
      update: updateMock,
    } as any);

    useBoardStore.setState((state) => ({
      ...state,
      columns: [
        {
          id: "col-1",
          title: "First",
          color: "green",
          position: 0,
          board_id: "board-1",
          cards: [],
        },
        {
          id: "col-2",
          title: "Second",
          color: "blue",
          position: 1,
          board_id: "board-1",
          cards: [],
        },
        {
          id: "col-3",
          title: "Third",
          color: "red",
          position: 2,
          board_id: "board-1",
          cards: [],
        },
      ],
    }));

    await act(async () => {
      await useBoardStore.getState().moveColumn("col-3", 0);
    });

    const ids = useBoardStore.getState().columns.map((c) => c.id);
    expect(ids).toEqual(["col-3", "col-1", "col-2"]);
    expect(updateMock).toHaveBeenCalled();
  });

  it("rolls back column order when moveColumn persistence fails", async () => {
    const failingUpdateMock = jest.fn().mockReturnValue({
      eq: jest.fn().mockRejectedValue(new Error("fail")),
    });

    mockedSupabase.from.mockReturnValue({
      update: failingUpdateMock,
    } as any);

    const originalColumns = [
      {
        id: "col-1",
        title: "First",
        color: "green",
        position: 0,
        board_id: "board-1",
        cards: [],
      },
      {
        id: "col-2",
        title: "Second",
        color: "blue",
        position: 1,
        board_id: "board-1",
        cards: [],
      },
    ];

    useBoardStore.setState((state) => ({
      ...state,
      columns: originalColumns,
    }));

    await act(async () => {
      await useBoardStore.getState().moveColumn("col-2", 0);
    });

    const ids = useBoardStore.getState().columns.map((c) => c.id);
    expect(ids).toEqual(originalColumns.map((c) => c.id));
  });
});

