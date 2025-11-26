import { Container, Dropdown, Stack, Row, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import TaskDrawer from "./components/TaskDrawer";
import { mockBoard as boardColumns } from "./mocks/boards.mock";
import type {
  BoardColumn as BoardColumnType,
  BoardColumnCard,
  RawBoardColumnCard,
} from "./types/board";
import BoardColumn from "./components/BoardColumn";
import TaskCard from "./components/TaskCard";
import AddColumnModal from "./components/AddColumnModal";
import { BoardProvider } from "./contexts/BoardContext";
import { useLocalStorage } from "./useLocalStorage";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { v4 as uuidV4 } from "uuid";

export default function Dashboard() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeColId, setActiveColId] = useState<string>();
  const [activeCard, setActiveCard] = useState<BoardColumnCard | null>(null);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [boardCols, setBoardCols] = useLocalStorage<BoardColumnType[]>(
    "BOARD_COLS",
    boardColumns
  );

  const clearUrlHash = () => {
    window.location.hash = "";
  };

  const handleHideDrawer = () => {
    clearUrlHash();
    setShowDrawer(false);
  };

  const handleOpenDrawer = (colId: string) => {
    setActiveColId(colId);
    setShowDrawer(true);
  };

  const onCreateTaskCard = (colId: string, taskData: BoardColumnCard) => {
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
    setBoardCols((prev) => [
      ...prev,
      {
        id: uuidV4(),
        name,
        color,
        cards: [],
      },
    ]);
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

  useEffect(() => {
    return () => {
      clearUrlHash();
    };
  }, []);

  return (
    <>
      <BoardProvider
        value={{ boardCols, setBoardCols, showDrawer, setShowDrawer }}
      >
        <DndContext
          onDragStart={handleCardDragStart}
          onDragEnd={handleCardDragdEnd}
        >
          <TaskDrawer
            onHide={handleHideDrawer}
            colId={activeColId!}
            colName={boardCols.find(({ id }) => id === activeColId)?.name}
            colColor={boardCols.find(({ id }) => id === activeColId)?.color}
            createTask={onCreateTaskCard}
            editTask={onEditTaskCard}
            deleteTask={onDeleteTaskCard}
          />
          <Container fluid>
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
                      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">
                        Another action
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item href="#/action-3">
                        Something else
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <h3 className="fw-bold text-white ms-4 mt-2 fs-4">
                    Personal Tasks
                  </h3>
                </div>

                <Button
                  variant="outline-secondary"
                  onClick={() => setShowAddColumnModal(true)}
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
                        showDrawer={handleOpenDrawer}
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
                    id: activeCard.id,
                    title: activeCard.title,
                    description: activeCard.description,
                    priority: activeCard.priority,
                  }}
                  showDrawer={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </BoardProvider>

      <AddColumnModal
        show={showAddColumnModal}
        onHide={() => setShowAddColumnModal(false)}
        onSave={handleAddColumn}
      />
    </>
  );
}
