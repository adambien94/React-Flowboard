/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { Board } from "../types/index";
import { useBoardStore } from "../store/useBoardStore";

type BoardsContextType = {
  boards: Board[];
  loading: boolean;
  error: string | null;
  refreshBoards: () => Promise<void>;
};

const BoardsContext = createContext<BoardsContextType | undefined>(undefined);

export const useBoardsContext = () => {
  const ctx = useContext(BoardsContext);
  if (!ctx) {
    throw new Error("useBoardsContext must be used within BoardsProvider");
  }
  return ctx;
};

type BoardsProviderProps = {
  children: ReactNode;
};

export const BoardsProvider = ({ children }: BoardsProviderProps) => {
  const { getBoardsList, boards } = useBoardStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshBoards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await getBoardsList();
    } catch (e: unknown) {
      console.error("Failed to load boards:", e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }, [getBoardsList]);

  useEffect(() => {
    refreshBoards();
  }, [refreshBoards]);

  return (
    <BoardsContext.Provider
      value={{
        boards: boards || [],
        loading,
        error,
        refreshBoards,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};
