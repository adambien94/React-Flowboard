export type BoardColumn = {
  id: string;
  name: string;
  color: string;
  cards: BoardColumnCard[];
};

export type BoardColumnCard = {
  id: string;
} & RawBoardColumnCard;

export type RawBoardColumnCard = {
  title: string;
  description: string;
  priority: string;
};
