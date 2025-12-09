import { Badge, Button } from "react-bootstrap";
import type { Card } from "../types/index";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTimerStore } from "../store/timerStore";
import { useTaskModalStore } from "../store/taskModalStore";
// import formatTime from "../utils/formatTime";

interface TaskCardProps {
  card: Card;
  showDrawer: () => void; // Opcjonalne, bo już nie używamy
}

const PRIORITIES: Record<string, string> = {
  low: "info",
  medium: "warning",
  high: "danger",
};

export default function TaskCard({ card, showDrawer }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
    });

  const {
    startTimer,
    stopTimer,
    activeTaskId: activeTimerTaskId,
  } = useTimerStore();

  const { openModal } = useTaskModalStore();

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    cursor: "pointer",
    transition: "border .2s ease-in-out 0.1s",
    border: card.id === activeTimerTaskId ? "1px solid var(--bs-primary)" : "",
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.hash = `#edit=${card.id}`;
    showDrawer();
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
    openModal(card.id);
  };

  return (
    <div key={card.id} className="mt-1">
      <div
        ref={setNodeRef}
        style={style}
        className="card h-100"
        {...attributes}
        onClick={onCardClick}
      >
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <Badge bg={PRIORITIES[card.priority as string]}> </Badge>
            <span
              style={{ fontSize: "14px" }}
              className="card-title w-100 mb-0 d-flex gap-2"
            >
              {card.title}
            </span>
            <div {...listeners}>
              <i
                className="bi bi-grip-vertical me-1 text-secondary"
                style={{
                  cursor: "grab",
                }}
              ></i>
            </div>
          </div>

          <div className="pe-4 pt-1">
            <p
              className="card-text mb-0 text-secondary"
              style={{
                fontSize: "14px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.4",
              }}
            >
              {card.description}
            </p>
          </div>
          <div className="flex-grow-1 mt-1 d-flex justify-content-between align-items-end gap-2">
            <span
              className="pt-1 text-secondary"
              style={{
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              0h 0min
            </span>

            <div className="d-flex gap-1" style={{ translate: "0 3px" }}>
              <Button
                variant="dark"
                size="sm"
                onClick={handleTimerClick}
                disabled={!!activeTimerTaskId && activeTimerTaskId !== card.id}
              >
                {activeTimerTaskId === card.id ? (
                  <i className="bi bi-pause-circle text-muted"></i>
                ) : (
                  <i className="bi bi-clock text-muted"></i>
                )}
              </Button>
              <Button onClick={handleEditClick} variant="dark" size="sm">
                <i className="bi bi-pencil text-muted"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
