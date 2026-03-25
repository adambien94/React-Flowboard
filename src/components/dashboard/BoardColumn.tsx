import React, { useState } from "react";
import { Button } from "react-bootstrap";
import type { Column, Card as CardType } from "../../types/index";
import TaskCard from "../TaskCard";
import { useDroppable, useDraggable, useDndContext } from "@dnd-kit/core";
import { useTaskDrawerStore } from "../../store/taskDrawerStore";
import ConfirmModal from "../ConfirmModal";
import { useBoardStore } from "../../hooks/useBoardStore";

type BoardColumnProps = {
  column: Column;
  isHidden?: boolean;
  disableDnD?: boolean;
};

type DroppableTaskCardProps = {
  card: CardType;
  columnId: string;
};

const BoardColumnComponent = ({
  column,
  isHidden,
  disableDnD,
}: BoardColumnProps) => {
  const { over } = useDndContext();
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
    disabled: disableDnD,
  });
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
  } = useDraggable({
    id: column.id,
    disabled: disableDnD,
  });
  const { openTaskDrawer, setActiveColId, activeColId, closeTaskDrawer } =
    useTaskDrawerStore();
  const { removeColumn } = useBoardStore();

  const [confirmRemoveShow, setConfirmRemoveShow] = useState(false);

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
        ref={setRefs}
        style={{ visibility: isHidden ? "hidden" : "visible" }}
      >
        <div className="fb-col-header">
          <span
            className="fb-col-dot"
            style={{ background: `var(--bs-${column.color})` }}
          />
          <span className="flex-grow-1">{column.title}</span>
          <button
            type="button"
            className="fb-btn fb-btn-ghost"
            title="Delete column"
            aria-label="Delete column"
            onClick={() => setConfirmRemoveShow(true)}
            style={{
              padding: 3,
              borderRadius: 6,
              transition: "0s all",
            }}
          >
            <i className="bi bi-trash" />
          </button>
          <button
            type="button"
            className="fb-btn fb-btn-ghost"
            title="Add card to column"
            aria-label="Add card to column"
            onClick={handleOpenDrawer}
            style={{
              padding: 3,
              borderRadius: 6,
              transition: "0s all",
            }}
          >
            <i className="bi bi-plus" />
          </button>
          <span className="fb-col-count">{column.cards.length}</span>
          <span className="fb-col-handle" {...listeners} {...attributes}>
            <i className="bi bi-grip-vertical" />
          </span>
        </div>

        <div
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
              style={{ fontSize: 12 }}
              className="board-column-empty text-center pt-4"
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

      <ConfirmModal
        show={confirmRemoveShow}
        onHide={() => setConfirmRemoveShow(false)}
        onConfirm={() => {
          setConfirmRemoveShow(false);

          if (activeColId === column.id) closeTaskDrawer();
          void removeColumn(column.id);
        }}
        title="Delete this column?"
        btnVariant="danger"
        confirmBtnText="Delete"
        message="This action permanently removes the selected column and all cards in it. It cannot be undone."
      />
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
