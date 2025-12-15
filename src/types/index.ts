export type Board = {
  id: string;
  owner?: string;
  title: string;
  created_at?: string;
};

export type Column = {
  id: string;
  board_id: string;
  title: string;
  position: number;
  created_at?: string;
  cards: Card[];
  color: string;
};

export type Card = {
  id: string;
  column_id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  position: number;
  created_at?: string;
  logged_time?: number;
};
