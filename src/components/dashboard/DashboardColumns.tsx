import { useMemo, useState } from "react";
import type { Card, Column } from "../../types/index";
import { Stack, Row, Col } from "react-bootstrap";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import BoardColumn from "./BoardColumn";
import TaskCard from "../TaskCard";
import { useBoardStore } from "../../hooks/useBoardStore";

const DashboardColumns = () => {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const { columns, moveCard, moveColumn } = useBoardStore();

  const boardCols = useMemo(() => columns ?? [], [columns]);

  const dragCardStyle = {
    transform: "rotate(0deg) translateY(-4px)",
    borderRadius: "18px",
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;

    const column = boardCols.find((col) => col.id === activeId);
    if (column) {
      setActiveColumn(column);
      setActiveCard(null);
      return;
    }

    const card = boardCols
      .flatMap((col) => col.cards)
      .find((card) => card?.id === activeId);

    setActiveCard(card || null);
    setActiveColumn(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    setActiveColumn(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isColumnDrag = boardCols.some((col) => col.id === activeId);

    if (isColumnDrag) {
      // Column dragging
      // Determine target column index (dropping over column or over a card inside a column)
      const overColumn =
        boardCols.find((col) => col.id === overId) ||
        boardCols.find((col) => col.cards.some((card) => card.id === overId));

      if (!overColumn) return;

      const targetIndex = boardCols.findIndex(
        (col) => col.id === overColumn.id
      );
      if (targetIndex === -1) return;

      await moveColumn(activeId, targetIndex);
      return;
    }

    // Card dragging
    const targetColumn = boardCols.find((col) => col.id === overId);
    if (targetColumn) {
      await moveCard(activeId, targetColumn.id, 0);
      return;
    }

    const columnWithTargetCard = boardCols.find((col) =>
      col.cards.some((card) => card.id === overId)
    );
    if (!columnWithTargetCard) return;

    const targetIndex = columnWithTargetCard.cards.findIndex(
      (card) => card.id === overId
    );
    if (targetIndex === -1) return;

    await moveCard(activeId, columnWithTargetCard.id, targetIndex);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Stack>
        <Row>
          {columns.map((col) => (
            <Col
              className="px-2 text-light"
              style={{ maxWidth: "calc(100%/3)" }}
            >
              <BoardColumn
                key={col.id}
                column={col}
                isHidden={activeColumn?.id === col.id}
              />
            </Col>
          ))}
        </Row>
      </Stack>
      <DragOverlay>
        {activeColumn ? (
          <div>
            <BoardColumn column={activeColumn} />
          </div>
        ) : activeCard ? (
          <div style={dragCardStyle}>
            <TaskCard card={{ ...activeCard }} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DashboardColumns;
