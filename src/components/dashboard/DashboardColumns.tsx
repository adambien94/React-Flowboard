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
    await moveCard(activeId, overId, 0);
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
