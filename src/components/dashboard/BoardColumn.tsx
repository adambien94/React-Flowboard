import React from "react";
import { Col, Card, Button } from "react-bootstrap";
import type { Column, Card as CardType } from "../../types/index";
import TaskCard from "../TaskCard";
import { useDroppable, useDraggable, useDndContext } from "@dnd-kit/core";
import { useTaskDrawerStore } from "../../store/taskDrawerStore";

type BoardColumnProps = {
  column: Column;
  isHidden?: boolean;
};

type DroppableTaskCardProps = {
  card: CardType;
  columnId: string;
};

const BoardColumnComponent = ({ column, isHidden }: BoardColumnProps) => {
  const { over } = useDndContext();
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
  });
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
  } = useDraggable({
    id: column.id,
  });
  const { openTaskDrawer, setActiveColId } = useTaskDrawerStore();

  const setRefs = (el: HTMLElement | null) => {
    setDroppableRef(el);
    setDraggableRef(el);
  };

  const isColumnActive = isOver || over?.data?.current?.columnId === column.id;

  const colStyle: React.CSSProperties = {
    background: isColumnActive
      ? "rgba(255,255,255,0.1)"
      : "rgba(255,255,255,0.05)",
    transition: "background 0.2s ease",
    border: "1px solid rgba(255,255,255,0.1)",
    borderTop: `2px solid var(--bs-${column.color})`,
    maxHeight: "calc(100vh - 160px)",
    overflow: "hidden",
    visibility: isHidden ? "hidden" : "visible",
  };

  const handleOpenDrawer = () => {
    setActiveColId(column.id);
    openTaskDrawer();
  };

  return (
    <>
      <Card ref={setRefs} style={colStyle}>
        <Card.Body className="px-2">
          <Card.Title className="mb-3 ps-2 d-flex justify-content-between">
            {column.title}
            <div className="d-flex gap-2">
              {/* <Button variant="outline-secondary" size="sm">
                  <i className="bi bi-pencil text-secondary"></i>
                </Button> */}
              <div {...listeners} {...attributes}>
                <i
                  className="bi bi-grip-vertical me-1 text-secondary"
                  style={{
                    cursor: "grab",
                  }}
                ></i>
              </div>
            </div>
          </Card.Title>

          {column.cards.length > 0 ? (
            column.cards.map((card: CardType) => (
              <DroppableTaskCard
                key={card.id}
                card={card}
                columnId={column.id}
              />
            ))
          ) : (
            <div
              style={{ fontSize: "14px" }}
              className="board-column-empty text-center"
            >
              List is empty.
            </div>
          )}

          <div className="mt-3 ps-2">
            <Button size="sm" variant="success" onClick={handleOpenDrawer}>
              <i className="bi bi-plus-circle"></i> Add Card
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

const BoardColumn = React.memo(BoardColumnComponent);

export default BoardColumn;

const DroppableTaskCard = ({ card, columnId }: DroppableTaskCardProps) => {
  const { setNodeRef } = useDroppable({
    id: card.id,
    data: {
      columnId,
    },
  });

  return (
    <div ref={setNodeRef}>
      <TaskCard card={card} />
    </div>
  );
};
