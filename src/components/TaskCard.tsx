import { Badge } from "react-bootstrap";
import type { BoardColumnCard } from "../types/board";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  card: BoardColumnCard;
  showDrawer: () => void;
}

const PRIORITIES: Record<string, string> = {
  LOW: "info",
  MEDIUM: "warning",
  HIGH: "danger",
};

export default function TaskCard({ card, showDrawer }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    cursor: "default",
  };

  const handleEditClick = () => {
    window.location.hash = `#edit=${card.id}`;
    showDrawer();
  };

  return (
    <div key={card.id} className="mt-2">
      <div
        ref={setNodeRef}
        style={style}
        className="card h-100"
        {...attributes}
      >
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <h6 className="card-title mb-0 d-flex align-items-center gap-2">
              <Badge bg={PRIORITIES[card.priority]}> </Badge>
              {card.title}
            </h6>
            <div {...listeners}>
              <i
                className="bi bi-grip-vertical me-1 text-muted"
                style={{
                  cursor: "grab",
                }}
              ></i>
            </div>
          </div>

          <div className="pe-4 pt-1">
            <p
              className="card-text mb-0 text-muted"
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
              0h 37min
            </span>

            <div className="d-flex gap-1" style={{ translate: "0 3px" }}>
              <button
                style={{
                  border: "none",
                  borderRadius: "50%",
                  background: "transparent",
                  paddingRight: "3px",
                  paddingLeft: "3px",
                }}
              >
                <i
                  className="bi bi-clock text-muted"
                  style={{
                    cursor: "pointer",
                  }}
                ></i>
              </button>
              <button
                onClick={handleEditClick}
                style={{
                  border: "none",
                  borderRadius: "50%",
                  background: "transparent",
                  paddingRight: "3px",
                  paddingLeft: "3px",
                }}
              >
                <i
                  className="bi bi-pencil text-muted"
                  style={{
                    cursor: "pointer",
                  }}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
