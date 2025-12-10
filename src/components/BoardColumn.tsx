import { Col, Card, Button } from "react-bootstrap";
import type { Column, Card as CardType } from "../types/index";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { useTaskDrawerStore } from "../store/taskDrawerStore";

type BoardColumnProps = {
  column: Column;
};

export default function BoardColumn({ column }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const { openTaskDrawer, setActiveColId } = useTaskDrawerStore();

  const colStyle = {
    background: isOver ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
    transition: "all 0.2s ease",
    border: "1px solid rgba(255,255,255,0.1)",
    borderTop: `2px solid var(--bs-${column.color})`,
  };

  const handleOpenDrawer = () => {
    setActiveColId(column.id);
    openTaskDrawer();
  };

  return (
    <>
      <Col className="px-2 text-light" style={{ maxWidth: "calc(100%/3)" }}>
        <Card ref={setNodeRef} style={colStyle}>
          <Card.Body className="px-2">
            <Card.Title className="mb-3 ps-2">{column.title}</Card.Title>
            {column.cards.length > 0 ? (
              column.cards.map((card: CardType) => (
                <TaskCard key={card.id} card={card} />
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
      </Col>
    </>
  );
}
