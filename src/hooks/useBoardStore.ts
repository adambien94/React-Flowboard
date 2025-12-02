import { create } from "zustand";
import { supabase } from "../api/supabaseClient";
import type { Column, Card } from "../types/index";

type State = {
  columns: Column[];
  loading: boolean;
  loadBoard: (boardId: string) => Promise<void>;
  addCard: (columnId: string, body: Partial<Card>) => Promise<void>;
  updateCard: (cardId: string, patch: Partial<Card>) => Promise<void>;
  moveCard: (
    cardId: string,
    toColumnId: string,
    newPosition: number
  ) => Promise<void>;
  subscribeRealtime: (boardId: string) => void;
};

export const useBoardStore = create<State>((set, get) => ({
  columns: [],
  loading: true,

  loadBoard: async (boardId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("columns")
      .select(
        "id, title, position, cards(id, title, description, priority, position, column_id)"
      )
      .eq("board_id", boardId)
      .order("position");

    if (error) {
      console.error(error);
      set({ loading: false });
      return;
    }

    // Supabase returns nested; sort cards by position
    const cols = (data || [])
      .map((c: any) => ({
        ...c,
        cards: (c.cards || []).sort(
          (a: Card, b: Card) => a.position - b.position
        ),
      }))
      .sort((a: Column, b: Column) => a.position - b.position);

    set({ columns: cols, loading: false });
  },

  addCard: async (columnId, body) => {
    // determine position -> append at end
    const columns = get().columns;
    const col = columns.find((c) => c.id === columnId);
    const pos = col ? col.cards?.length ?? 0 : 0;

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

    // optimistic update
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
    const { error } = await supabase
      .from("cards")
      .update(patch)
      .eq("id", cardId);
    if (error) console.error(error);
    // realtime subscription will update UI when change happens
  },

  moveCard: async (cardId, toColumnId, newPosition) => {
    // Update card's column_id and position (this is basic; you may want a transaction on server)
    const { error } = await supabase
      .from("cards")
      .update({ column_id: toColumnId, position: newPosition })
      .eq("id", cardId);

    if (error) {
      console.error(error);
      return;
    }

    // Optionally reindex other cards client-side or via RPC on server
  },

  subscribeRealtime: (boardId) => {
    // unsubscribe previous channels if needed
    // subscribe to changes in cards and columns for this board
    const cardsChannel = supabase
      .channel("public:cards")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cards" },
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
      .channel("public:columns")
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

    // store channels somewhere if you need to unsub later
  },
}));
