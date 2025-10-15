import { createContext, useContext, ReactNode } from "react";
import type { BoardColumn, BoardColumnCard } from "../types/board";

interface BoardContextType {
  boardCols: BoardColumn[];
  setBoardCols: React.Dispatch<React.SetStateAction<BoardColumn[]>>;
  showDrawer: boolean;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return context;
};

interface BoardProviderProps {
  children: ReactNode;
  value: BoardContextType;
}

export const BoardProvider = ({ children, value }: BoardProviderProps) => {
  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};
