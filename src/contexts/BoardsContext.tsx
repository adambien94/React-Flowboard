import { createContext, useContext, type ReactNode } from "react";
import type { Board } from "../types/board";
import { useLocalStorage } from "../useLocalStorage";
import { mockBoards } from "../mocks/boards.mock";

type BoardsContextType = {
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
};

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export const useBoardsContext = () => {
  const context = useContext(BoardsContext);
  if (!context) {
    throw new Error("useBoardsContext must be used within BoardsProvider");
  }
  return context;
};

type BoardsProviderProps = {
  children: ReactNode;
};

export const BoardsProvider = ({ children }: BoardsProviderProps) => {
  const [boards, setBoards] = useLocalStorage<Board[]>(
    "FlowBOARD_BOARDS",
    mockBoards
  );

  return (
    <BoardsContext.Provider value={{ boards, setBoards }}>
      {children}
    </BoardsContext.Provider>
  );
};
