import React from "react";
import { Button } from "react-bootstrap";
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

  const handleOpenDrawer = () => {
    setActiveColId(column.id);
    openTaskDrawer();
  };

  return (
    <>
      <div
        className="fb-column"
        style={{ visibility: isHidden ? "hidden" : "visible" }}
      >
        <div className="fb-col-header">
          <span
            className="fb-col-dot"
            style={{ background: `var(--bs-${column.color})` }}
          />
          <span className="flex-grow-1">{column.title}</span>
          <span className="fb-col-count">{column.cards.length}</span>
          <span className="fb-col-handle" {...listeners} {...attributes}>
            ⋯
          </span>
        </div>

        <div
          ref={setRefs}
          className="fb-cards-wrapper"
          style={{
            boxShadow: isColumnActive
              ? "0 0 0 1px var(--fb-border-strong) inset"
              : undefined,
          }}
        >
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
              style={{ fontSize: 12, padding: "10px 8px" }}
              className="board-column-empty text-center"
            >
              List is empty.
            </div>
          )}

          <div className="mt-2 d-flex">
            <Button
              variant="link"
              className="text-decoration-none col text-start"
              onClick={handleOpenDrawer}
            >
              + Add card
            </Button>
          </div>
        </div>
      </div>
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
