import { Container, Dropdown, Stack, Row, Button } from "react-bootstrap";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskDrawer from "./components/TaskDrawer";
import type {
  BoardColumn as BoardColumnType,
  BoardColumnCard,
  RawBoardColumnCard,
} from "./types/board";
import BoardColumn from "./components/BoardColumn";
import TaskCard from "./components/TaskCard";
import Timer from "./components/Timer";
import AddColumnModal from "./components/AddColumnModal";
import { BoardProvider } from "./contexts/BoardContext";
import { useBoardsContext } from "./contexts/BoardsContext";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { v4 as uuidV4 } from "uuid";
import { useTimerStore } from "./store/timerStore";
import ConfirmModal from "./components/ConfirmModal";
import formatTime from "./utils/formatTime";

export default function Dashboard() {
  const [drawerShow, setDrawerShow] = useState(false);
  const [activeColId, setActiveColId] = useState<string>();
  const [activeCard, setActiveCard] = useState<BoardColumnCard | null>(null);
  const [addColumnModalShow, setAddColumnModalShow] = useState(false);
  const [confirmLogTimeShow, setConfirmLogTimeShow] = useState(false);
  const { boards, setBoards } = useBoardsContext();
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { setTimeToLog, timeToLog, isTimerShow } = useTimerStore();

  const activeBoard = useMemo(() => {
    return boards.find((board) => board.id === boardId) ?? boards[0];
  }, [boardId, boards]);

  const activeBoardId = activeBoard?.id;
  const boardCols = useMemo(() => activeBoard?.columns ?? [], [activeBoard]);

  const clearUrlHash = () => {
    window.location.hash = "";
  };

  useEffect(() => {
    if (!boards.length) return;
    if (!boardId || !boards.some((board) => board.id === boardId)) {
      console.log(boards);
      navigate(`/${boards[0].id}`, { replace: true });
    }
  }, [boardId, boards, navigate]);

  useEffect(() => {
    if (!boardCols.length) {
      setDrawerShow(false);
      setActiveColId(undefined);
      clearUrlHash();
      return;
    }
    const columnExists = boardCols.some(({ id }) => id === activeColId);
    if (!columnExists) {
      setActiveColId(boardCols[0].id);
      setDrawerShow(false);
      clearUrlHash();
    }
  }, [boardCols, activeColId]);

  const setBoardCols = useCallback(
    (value: React.SetStateAction<BoardColumnType[]>) => {
      if (!activeBoardId) return;
      setBoards((prevBoards) =>
        prevBoards.map((board) => {
          if (board.id !== activeBoardId) {
            return board;
          }
          const nextColumns =
            typeof value === "function" ? value(board.columns) : value;
          return { ...board, columns: nextColumns };
        })
      );
    },
    [activeBoardId, setBoards]
  );

  const handleHideDrawer = () => {
    clearUrlHash();
    setDrawerShow(false);
  };

  const handleOpenDrawer = (colId: string) => {
    setActiveColId(colId);
    setDrawerShow(true);
  };

  const onCreateTaskCard = (colId: string, taskData: BoardColumnCard) => {
    if (!activeBoardId) return;
    setBoardCols((prev) => {
      return prev.map((col) => {
        if (col.id === colId) {
          return {
            ...col,
            cards: [...col.cards, taskData],
          };
        } else {
          return col;
        }
      });
    });
  };

  const onEditTaskCard = (
    colId: string,
    cardId: string,
    taskData: RawBoardColumnCard
  ) => {
    if (!activeBoardId) return;
    setBoardCols((prev) => {
      return prev.map((col) => {
        if (col.id !== colId) {
          return col;
        }
        return {
          ...col,
          cards: col.cards.map((card) => {
            if (card.id === cardId) {
              return { ...card, ...taskData };
            }
            return card;
          }),
        };
      });
    });
  };

  const onDeleteTaskCard = (colId: string, cardId: string) => {
    if (!activeBoardId) return;
    setBoardCols((prev) =>
      prev.map((col) => {
        if (col.id !== colId) {
          return col;
        }
        return {
          ...col,
          cards: col.cards.filter((card) => card.id !== cardId),
        };
      })
    );
  };

  const handleAddColumn = (name: string, color: string) => {
    if (!activeBoardId) return;
    const newColumnId = uuidV4();
    setBoardCols((prev) => [
      ...prev,
      {
        id: newColumnId,
        name,
        color,
        cards: [],
      },
    ]);
    setActiveColId(newColumnId);
  };

  const handleCardDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = boardCols
      .flatMap((col) => col.cards)
      .find((card) => card.id === active.id);
    setActiveCard(card || null);
  };

  const handleCardDragdEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const sourceColumn = boardCols.find((col) =>
      col.cards.some((card) => card.id === activeId)
    );
    if (!sourceColumn) return;

    const sourceCard = sourceColumn.cards.find((card) => card.id === activeId);
    if (!sourceCard) return;

    const targetColumn =
      boardCols.find((col) => col.id === overId) ||
      boardCols.find((col) => col.cards.some((card) => card.id === overId));
    if (!targetColumn || sourceColumn.id === targetColumn.id) return;

    setBoardCols((prev) => {
      return prev.map((col) => {
        if (col.id === sourceColumn.id) {
          return {
            ...col,
            cards: col.cards.filter((card) => card.id !== activeId),
          };
        } else if (col.id === targetColumn.id) {
          return {
            ...col,
            cards: [...col.cards, sourceCard],
          };
        }
        return col;
      });
    });
  };

  // Timer
  const logTime = (taskId: string, time: number) => {
    setBoardCols((prev) => {
      return prev.map((col) => {
        return {
          ...col,
          cards: col.cards.map((card) => {
            if (card.id === taskId) {
              return { ...card, loggedTime: (card?.loggedTime || 0) + time };
            }
            return card;
          }),
        };
      });
    });
  };

  const handleLogTime = () => {
    if (timeToLog) logTime(timeToLog?.taskId, timeToLog?.time);
    setConfirmLogTimeShow(false);
  };

  const handleStopTimer = (taskId: string, time: number) => {
    setTimeToLog(taskId, time);
    setConfirmLogTimeShow(true);
  };
  //

  useEffect(() => {
    return () => {
      clearUrlHash();
    };
  }, []);

  return (
    <>
      <BoardProvider
        value={{ boardCols, setBoardCols, drawerShow, setDrawerShow }}
      >
        <DndContext
          onDragStart={handleCardDragStart}
          onDragEnd={handleCardDragdEnd}
        >
          {activeColId && (
            <TaskDrawer
              onHide={handleHideDrawer}
              colId={activeColId}
              colName={boardCols.find(({ id }) => id === activeColId)?.name}
              colColor={boardCols.find(({ id }) => id === activeColId)?.color}
              createTask={onCreateTaskCard}
              editTask={onEditTaskCard}
              deleteTask={onDeleteTaskCard}
            />
          )}
          <Container fluid>
            <div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="dropdown-basic"
                    >
                      {activeBoard?.name ?? "Boards"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {boards.map((board) => (
                        <Dropdown.Item
                          key={board.id}
                          active={board.id === activeBoardId}
                          onClick={() => {
                            if (board.id === activeBoardId) return;
                            navigate(`/${board.id}`);
                          }}
                        >
                          {board.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  <h3 className="fw-bold text-white ms-4 mt-2 fs-4">
                    {activeBoard?.name}
                  </h3>
                </div>

                <Button
                  variant="outline-secondary"
                  onClick={() => setAddColumnModalShow(true)}
                  disabled={boardCols.length >= 4}
                >
                  <i className="bi bi-plus-circle"></i> Add column
                </Button>
              </div>

              <div className="mt-3">
                <Stack>
                  <Row>
                    {boardCols.map((col) => (
                      <BoardColumn
                        key={col.id}
                        column={col}
                        drawerShow={handleOpenDrawer}
                      />
                    ))}
                  </Row>
                </Stack>
              </div>
            </div>
          </Container>

          <DragOverlay>
            {activeCard ? (
              <div
                style={{
                  opacity: 1,
                  transform: "rotate(0deg) translateY(-8px)",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                }}
              >
                <TaskCard
                  card={{
                    ...activeCard,
                  }}
                  showDrawer={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </BoardProvider>

      <Timer show={isTimerShow} onFinish={handleStopTimer} />

      <ConfirmModal
        show={confirmLogTimeShow}
        setShow={setConfirmLogTimeShow}
        onConfirm={handleLogTime}
        title="Log time"
        message={`Do you want to log time? (${formatTime(
          timeToLog?.time as number,
          true
        )} )`}
        confirmBtnText="Log Time"
      />

      <AddColumnModal
        show={addColumnModalShow}
        onHide={() => setAddColumnModalShow(false)}
        onSave={handleAddColumn}
      />
    </>
  );
}
