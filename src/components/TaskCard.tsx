import React from "react";
import { Button } from "react-bootstrap";
import type { Card } from "../types/index";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTimerStore } from "../store/timerStore";
import { useTaskModalStore } from "../store/taskModalStore";
import { useTaskDrawerStore } from "../store/taskDrawerStore";
import formatTime from "../utils/formatTime";

type TaskCardProps = {
  card: Card;
};

const priorityClass = (priority?: string) => {
  switch (priority) {
    case "high":
      return "fb-priority fb-priority-high";
    case "medium":
      return "fb-priority fb-priority-medium";
    case "low":
      return "fb-priority fb-priority-low";
    default:
      return "fb-priority fb-priority-none";
  }
};

const TaskCardComponent = ({ card }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
    });
  const {
    startTimer,
    stopTimer,
    activeTaskId: activeTimerTaskId,
  } = useTimerStore();
  const { openTaskModal } = useTaskModalStore();
  const { openTaskDrawer } = useTaskDrawerStore();

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    cursor: "pointer",
    transition: "border .2s ease-in-out 0.1s",
    outline: card.id === activeTimerTaskId ? "1px solid var(--bs-primary)" : "",
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openTaskDrawer(card.id);
  };

  const handleTimerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!!activeTimerTaskId && activeTimerTaskId === card.id) {
      stopTimer();
    } else if (!activeTimerTaskId) {
      startTimer(card.id);
    }
  };

  const onCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openTaskModal(card.id);
  };

  return (
    <div key={card.id}>
      <div
        ref={setNodeRef}
        style={style}
        className="card h-100 fb-task-card"
        {...attributes}
        onClick={onCardClick}
      >
        <div className="card-body d-flex flex-column pb-2">
          <div className="d-flex justify-content-between">
            <div className={priorityClass(card.priority)}>
              {card.priority ? card.priority : "Backlog"}
            </div>
            <div {...listeners}>
              <i
                className="bi bi-grip-vertical me-1"
                style={{
                  cursor: "grab",
                  color: "var(--fb-text-faint)",
                }}
              ></i>
            </div>
          </div>

          <div className="d-flex align-items-start justify-content-between gap-2">
            <div className="w-100">
              <div
                className="card-title w-100 mb-0"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  color: "var(--fb-text)",
                }}
              >
                {card.title}
              </div>
            </div>
          </div>

          <div className="pe-4 pt-1">
            <p
              className="card-text mb-0"
              style={{
                fontSize: 11,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.4,
                color: "var(--fb-text-faint)",
              }}
            >
              {card.description}
            </p>
          </div>
          <div className="flex-grow-1 d-flex justify-content-between align-items-center gap-2 border-top mt-2">
            <span
              className="pt-1"
              style={{
                fontSize: 11,
                lineHeight: 1.4,
                color: "var(--fb-text-faint)",
                fontFamily:
                  '"DM Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              {card.logged_time
                ? formatTime(card.logged_time, true)
                : "0h 0min "}
            </span>

            <div className="d-flex" style={{ translate: "0 3px" }}>
              <Button
                variant="action"
                size="sm"
                onClick={handleTimerClick}
                disabled={!!activeTimerTaskId && activeTimerTaskId !== card.id}
              >
                {activeTimerTaskId === card.id ? (
                  <i
                    className="bi bi-pause-circle"
                    style={{ color: "var(--fb-text-muted)" }}
                  ></i>
                ) : (
                  <i
                    className="bi bi-clock"
                    style={{ color: "var(--fb-text-muted)" }}
                  ></i>
                )}
              </Button>
              <Button onClick={handleEditClick} variant="action" size="sm">
                <i
                  className="bi bi-pencil"
                  style={{ color: "var(--fb-text-muted)" }}
                ></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard = React.memo(TaskCardComponent);

export default TaskCard;
