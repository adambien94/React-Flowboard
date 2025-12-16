import { useMemo, useState } from "react";
import type { Card } from "../../types/index";
import { Stack, Row } from "react-bootstrap";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import BoardColumn from "./BoardColumn";
import TaskCard from "../TaskCard";
import { useBoardStore } from "../../hooks/useBoardStore";

const DashboardColumns = () => {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const { columns, moveCard } = useBoardStore();

  const boardCols = useMemo(() => columns ?? [], [columns]);

  const dragCardStyle = {
    transform: "rotate(0deg) translateY(-4px)",
    borderRadius: "18px",
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

    console.log(11111);

    await moveCard(activeId, columnWithTargetCard.id, targetIndex);
  };

  return (
    <DndContext
      onDragStart={handleCardDragStart}
      onDragEnd={handleCardDragdEnd}
    >
      <Stack>
        <Row>
          {columns.map((col) => (
            <BoardColumn key={col.id} column={col} />
          ))}
        </Row>
      </Stack>
      <DragOverlay>
        {activeCard && (
          <div style={dragCardStyle}>
            <TaskCard card={{ ...activeCard }} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default DashboardColumns;
