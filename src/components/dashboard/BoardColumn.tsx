import { Col, Card, Button } from "react-bootstrap";
import type { Column, Card as CardType } from "../../types/index";
import TaskCard from "../TaskCard";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { useTaskDrawerStore } from "../../store/taskDrawerStore";

type BoardColumnProps = {
  column: Column;
};

type DroppableTaskCardProps = {
  card: CardType;
  columnId: string;
};

export default function BoardColumn({ column }: BoardColumnProps) {
  const { over } = useDndContext();
  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  const { openTaskDrawer, setActiveColId } = useTaskDrawerStore();

  const isColumnActive = over?.data?.current?.columnId === column.id;

  const colStyle = {
    background: isColumnActive
      ? "rgba(255,255,255,0.1)"
      : "rgba(255,255,255,0.05)",
    transition: "all 0.2s ease",
    border: "1px solid rgba(255,255,255,0.1)",
    borderTop: `2px solid var(--bs-${column.color})`,
    maxHeight: "calc(100vh - 160px)",
    overflow: "hidden",
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
      </Col>
    </>
  );
}

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
