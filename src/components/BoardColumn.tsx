import { Col, Card, Button } from "react-bootstrap";
import type { Column, Card as CardType } from "../types/index";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

interface BoardColumnProps {
  column: Column;
  drawerShow: (colId: string) => void;
}

export default function BoardColumn({ column, drawerShow }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const colStyle = {
    background: isOver ? "#343545" : "#292a37",
    transition: "all 0.2s ease",
    border: "none",
    borderTop: `2px solid var(--bs-${column.color})`,
  };

  return (
    <>
      <Col className="px-2 text-light" style={{ maxWidth: "calc(100%/3)" }}>
        <Card ref={setNodeRef} style={colStyle}>
          <Card.Body className="px-2">
            <Card.Title className="mb-3 ps-2">{column.title}</Card.Title>
            {column.cards.length > 0 ? (
              column.cards.map((card: CardType) => (
                <TaskCard
                  key={card.id}
                  card={card}
                  showDrawer={() => drawerShow(column.id)}
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
              <Button
                size="sm"
                variant="success"
                onClick={() => drawerShow(column.id)}
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
