import { create } from "zustand";
import { supabase } from "../api/supabaseClient";
import type { Column, Card, Board } from "../types/index";

type State = {
  columns: Column[];
  loading: boolean;
  boardTitle: string;
  channels: any[];
  boards: Board[];
  getBoardsList: () => Promise<void>;
  loadBoard: (boardId: string) => Promise<void>;
  addBoard: (title: string) => Promise<void>;
  addCard: (columnId: string, body: Partial<Card>) => Promise<void>;
  updateCard: (cardId: string, patch: Partial<Card>) => Promise<void>;
  addColumn: (boardId: string, title: string, color?: string) => Promise<void>;
  moveCard: (
    cardId: string,
    toColumnId: string,
    newPosition: number
  ) => Promise<void>;
  removeCard: (cardId: string) => Promise<void>;
  subscribeRealtime: (boardId: string) => void;
  unsubscribeRealtime: () => void;
};

export const useBoardStore = create<State>((set, get) => ({
  columns: [],
  loading: true,
  boardTitle: "",
  channels: [],
  boards: [],

  getBoardsList: async () => {
    const { data, error } = await supabase
      .from("boards")
      .select("id, title")
      .order("title", { ascending: true });

    if (error) {
      console.error("❌ Failed to load boards list:", error);
      set({ loading: false });
      return;
    }

    set({
      boards: data || [],
    });
  },

  loadBoard: async (boardId) => {
    set({ loading: true });

    const { data: boardData } = await supabase
      .from("boards")
      .select("title")
      .eq("id", boardId)
      .single();

    const { data, error } = await supabase
      .from("columns")
      .select(
        "id, title, color, position, cards(id, title, description, priority, position, column_id)"
      )
      .eq("board_id", boardId)
      .order("position");

    if (error) {
      console.error(error);
      set({ loading: false });
      return;
    }

    const cols = (data || [])
      .map((c: any) => ({
        ...c,
        cards: (c.cards || []).sort(
          (a: Card, b: Card) => a.position - b.position
        ),
      }))
      .sort((a: Column, b: Column) => a.position - b.position);

    set({
      columns: cols,
      boardTitle: boardData?.title || "",
      loading: false,
    });
  },

  addBoard: async (title: string) => {
    const { data, error } = await supabase
      .from("boards")
      .insert({ title })
      .select()
      .single();

    if (error) {
      console.error("❌ Failed to add board:", error);
      set({ loading: false });
      return;
    }

    set((state) => ({
      boards: [...state.boards, data].sort((a, b) =>
        a.title.localeCompare(b.title)
      ),
    }));
  },

  addCard: async (columnId, body) => {
    // const columns = get().columns;
    // const col = columns.find((c) => c.id === columnId);
    // const pos = col ? col.cards?.length ?? 0 : 0;
    const { data, error } = await supabase
      .from("cards")
      .insert({
        column_id: columnId,
        title: body.title,
        description: body.description,
        priority: body.priority,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    set((state) => {
      const updated = state.columns.map((c) => {
        if (c.id === columnId) {
          return { ...c, cards: [...(c.cards || []), data] };
        }
        return c;
      });
      return { columns: updated };
    });
  },

  updateCard: async (cardId, patch) => {
    set((state) => ({
      columns: state.columns.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card.id === cardId ? { ...card, ...patch } : card
        ),
      })),
    }));

    const { error } = await supabase
      .from("cards")
      .update(patch)
      .eq("id", cardId);

    if (error) console.error(error);
  },

  moveCard: async (cardId, toColumnId, newPosition) => {
    const prevColumns = structuredClone(get().columns);

    set((state) => {
      const newCols = state.columns.map((col) => ({
        ...col,
        cards: col.cards.filter((c) => c.id !== cardId),
      }));

      const card = prevColumns
        .flatMap((c) => c.cards)
        .find((c) => c.id === cardId);

      if (card) {
        card.column_id = toColumnId;
        card.position = newPosition;

        const targetCol = newCols.find((c) => c.id === toColumnId);
        if (targetCol) targetCol.cards.splice(newPosition, 0, card);
      }

      return { columns: newCols };
    });

    const { error } = await supabase
      .from("cards")
      .update({ column_id: toColumnId, position: newPosition })
      .eq("id", cardId);

    if (error) {
      console.error("❌ Couldn't move card:", error);
      set({ columns: prevColumns });
    }
  },

  removeCard: async (cardId: string) => {
    const prevState = get().columns;

    set((state) => {
      const updatedColumns = state.columns.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      }));

      return { columns: updatedColumns };
    });

    const { error } = await supabase.from("cards").delete().eq("id", cardId);

    if (error) {
      console.error("❌ Failed to delete card:", error);
      set({ columns: prevState });
    }
  },

  addColumn: async (boardId: string, title: string, color?: string) => {
    const { columns } = get();
    const position = columns.length;

    const { data, error } = await supabase
      .from("columns")
      .insert({
        title,
        color: color ?? "gray",
        board_id: boardId,
        position,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Failed to add column:", error);
      return;
    }

    set((state) => ({
      columns: [...state.columns, { ...data, cards: [] }],
    }));
  },

  subscribeRealtime: (boardId) => {
    // unsubscribe previous channels if needed
    // subscribe to changes in cards and columns for this board
    get().unsubscribeRealtime();

    const cardsChannel = supabase
      .channel(`board:${boardId}:cards`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cards",
          filter: `column_id=in.(${get()
            .columns.map((c) => c.id)
            .join(",")})`, // Filter by column IDs
        },
        (payload) => {
          // handle INSERT / UPDATE / DELETE payload
          const ev = payload.eventType;
          const record = payload.new ?? payload.old;
          set((state) => {
            let cols = [...state.columns];
            if (!record) return state;

            if (ev === "INSERT") {
              // find column and push
              cols = cols.map((c) =>
                c.id === record.column_id
                  ? { ...c, cards: [...(c.cards || []), record] }
                  : c
              );
            } else if (ev === "UPDATE") {
              // find and update card
              cols = cols.map((c) => ({
                ...c,
                cards: (c.cards || []).map((card: any) =>
                  card.id === record.id ? { ...card, ...record } : card
                ),
              }));
            } else if (ev === "DELETE") {
              cols = cols.map((c) => ({
                ...c,
                cards: (c.cards || []).filter(
                  (card: any) => card.id !== record.id
                ),
              }));
            }
            // optionally sort cards by position
            cols = cols.map((c) => ({
              ...c,
              cards: (c.cards || []).sort(
                (a: any, b: any) => a.position - b.position
              ),
            }));
            return { columns: cols };
          });
        }
      )
      .subscribe();

    const colsChannel = supabase
      .channel(`board:${boardId}:columns`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "columns" },
        (payload) => {
          const ev = payload.eventType;
          const record = payload.new ?? payload.old;
          set((state) => {
            let cols = [...state.columns];
            if (!record) return state;
            if (ev === "INSERT") {
              cols.push({ ...record, cards: [] });
            } else if (ev === "UPDATE") {
              cols = cols.map((c) =>
                c.id === record.id ? { ...c, ...record } : c
              );
            } else if (ev === "DELETE") {
              cols = cols.filter((c) => c.id !== record.id);
            }
            cols = cols.sort((a, b) => a.position - b.position);
            return { columns: cols };
          });
        }
      )
      .subscribe();

    set({ channels: [cardsChannel, colsChannel] });
  },

  unsubscribeRealtime: () => {
    const channels = get().channels;
    channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    set({ channels: [] });
  },
}));
