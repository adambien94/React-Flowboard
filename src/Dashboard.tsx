import { Container, Dropdown, Stack, Row, Button } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskDrawer from "./components/TaskDrawer";
import type { Card } from "./types/index";
import BoardColumn from "./components/BoardColumn";
import TaskCard from "./components/TaskCard";
import Timer from "./components/Timer";
import AddColumnModal from "./components/AddColumnModal";
import TaskModal from "./components/TaskModal";
import { BoardProvider } from "./contexts/BoardContext";
import { useBoardsContext } from "./contexts/BoardsContext";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useTimerStore } from "./store/timerStore";
import ConfirmModal from "./components/ConfirmModal";
import formatTime from "./utils/formatTime";
import { useBoardStore } from "./hooks/useBoardStore";
import BoardLoader from "./components/BoardLoader";

export default function Dashboard() {
  const [drawerShow, setDrawerShow] = useState(false);
  const [activeColId, setActiveColId] = useState<string>();
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [addColumnModalShow, setAddColumnModalShow] = useState(false);
  const [taskModalShow, setTaskModalShow] = useState(false);
  const [confirmLogTimeShow, setConfirmLogTimeShow] = useState(false);
  const { boards } = useBoardsContext();
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { setTimeToLog, timeToLog, isTimerShow, clearActiveTaskId } =
    useTimerStore();

  const activeBoardId = boardId || "";
  const {
    loadBoard,
    boardTitle,
    columns,
    addColumn,
    updateCard,
    addCard,
    moveCard,
    removeCard,
    subscribeRealtime,
    unsubscribeRealtime,
    loading,
    // setLoader,
  } = useBoardStore();

  const boardCols = useMemo(() => columns ?? [], [columns]);

  useEffect(() => {
    if (!activeBoardId) {
      // setLoader(false);
      return;
    }

    loadBoard(activeBoardId);
    subscribeRealtime(activeBoardId);

    return () => unsubscribeRealtime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBoardId]);

  const clearUrlHash = () => {
    window.location.hash = "";
  };

  useEffect(() => {
    if (!boards.length) return;
    if (!activeBoardId || !boards.some((board) => board.id === activeBoardId)) {
      navigate(`/${boards[0].id}`, { replace: true });
    }
  }, [activeBoardId, boards, navigate]);

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

  const handleHideDrawer = () => {
    clearUrlHash();
    setDrawerShow(false);
  };

  const handleOpenDrawer = (colId: string) => {
    setActiveColId(colId);
    setDrawerShow(true);
  };

  const handleCardDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = boardCols
      .flatMap((col) => col.cards)
      .find((card) => card?.id === active.id);
    setActiveCard(card || null);
  };

  const handleCardDragdEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    await moveCard(activeId, overId, 0);
  };

  // const logTime = (taskId: string, time: number) => {
  //   setBoardCols((prev) => {
  //     return prev.map((col) => {
  //       return {
  //         ...col,
  //         cards: col.cards.map((card) => {
  //           if (card.id === taskId) {
  //             return { ...card, loggedTime: (card?.loggedTime || 0) + time };
  //           }
  //           return card;
  //         }),
  //       };
  //     });
  //   });
  // };

  const handleLogTime = () => {
    // if (timeToLog) logTime(timeToLog?.taskId, timeToLog?.time);
    clearActiveTaskId();
    setConfirmLogTimeShow(false);
  };

  const handleStopTimer = (taskId: string, time: number) => {
    setTimeToLog(taskId, time);
    setConfirmLogTimeShow(true);
  };

  const handleAddColumn = (name: string, color: string) => {
    addColumn(activeBoardId, name, color);
  };

  useEffect(() => {
    return () => {
      clearUrlHash();
    };
  }, []);

  return (
    <>
      {loading ? (
        <BoardLoader />
      ) : (
        <BoardProvider value={{ boardCols, drawerShow, setDrawerShow }}>
          <DndContext
            onDragStart={handleCardDragStart}
            onDragEnd={handleCardDragdEnd}
          >
            {activeColId && (
              <TaskDrawer
                onHide={handleHideDrawer}
                colId={activeColId}
                colName={boardCols.find(({ id }) => id === activeColId)?.title}
                colColor={boardCols.find(({ id }) => id === activeColId)?.color}
                createTask={addCard}
                editTask={updateCard}
                deleteTask={removeCard}
              />
            )}
            <Container fluid>
              {boards.length ? (
                <div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          id="dropdown-basic"
                        >
                          Boards
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
                              {board.title}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                      <h3 className="fw-bold text-white ms-4 mt-2 fs-4">
                        {boardTitle}
                      </h3>
                    </div>

                    <Button
                      variant="outline-secondary"
                      onClick={() => setAddColumnModalShow(true)}
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
              ) : (
                <div className="text-center">
                  <h1 className="mt-5 mb-4">Create your first Board !</h1>
                  <Button size="lg" variant="outline-secondary">
                    <i className="bi bi-plus-circle me-3"></i>
                    Create Board
                  </Button>
                </div>
              )}
            </Container>

            <DragOverlay>
              {activeCard ? (
                <div
                  style={{
                    transform: "rotate(0deg) translateY(-4px)",
                    borderRadius: "18px",
                    // boxShadow: "0px 3px 3px rgba(255,255,255,0.1)",
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
      )}

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

      <TaskModal
        show={!taskModalShow}
        onHide={() => setTaskModalShow(!taskModalShow)}
      />
    </>
  );
}
