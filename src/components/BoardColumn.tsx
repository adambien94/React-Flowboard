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
  };

  return (
    <>
      <Col className="px-2">
        <Card bg="light" ref={setNodeRef} style={colStyle}>
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
              <div className="text-muted text-center py-1">List is empty.</div>
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
