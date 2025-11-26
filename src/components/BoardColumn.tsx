import { Col, Card, Button } from "react-bootstrap";
import type { BoardColumn, BoardColumnCard } from "../types/board";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

interface BoardColumnProps {
  column: BoardColumn;
  showDrawer: (colId: string) => void;
}

export default function BoardColumn({ column, showDrawer }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const colStyle = {
    filter: isOver ? "brightness(0.8)" : undefined,
    transition: "all 0.2s ease",
    border: "none",
    borderTop: `6px solid var(--bs-${column.color})`,
    boxShadow: "0px 1px 2px  rgba(255,255,255, 0.3)",
  };

  return (
    <>
      <Col className="px-2 text-light">
        <Card ref={setNodeRef} style={colStyle}>
          <Card.Body>
            <Card.Title className="mb-3">{column.name}</Card.Title>
            {column.cards.length > 0 ? (
              column.cards.map((card: BoardColumnCard) => (
                <TaskCard
                  key={card.id}
                  card={card}
                  showDrawer={() => showDrawer(column.id)}
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
            <div className="mt-3">
              <Button
                size="sm"
                variant="success"
                onClick={() => showDrawer(column.id)}
              >
                <i className="bi bi-plus-circle"></i> Add Card
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
