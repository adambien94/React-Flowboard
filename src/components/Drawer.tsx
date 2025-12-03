import { useState } from "react";
import { Offcanvas, ListGroup, Button, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import AddBoardModal from "./AddBoardModal";
import { useBoardsContext } from "../contexts/BoardsContext";
import { useBoardStore } from "../hooks/useBoardStore";

type DrawerProps = {
  show: boolean;
  onHide: () => void;
};

export default function Drawer({ show, onHide }: DrawerProps) {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const { boards } = useBoardsContext();
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const { addBoard } = useBoardStore();

  const handleBoardSelect = (targetBoardId: string) => {
    if (targetBoardId === boardId) {
      return;
    }
    navigate(`/${targetBoardId}`);
  };

  const handleCreateBoard = async (title: string) => {
    await addBoard(title);
    setShowCreateBoardModal(false);
    // navigate(`/${newBoardId}`);
  };

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="start"
      backdrop={false}
      scroll={true}
      className="shadow-none"
      data-bs-theme="dark"
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-bold text-light">
          <i className="bi bi-kanban me-2"></i>
          Flowboard
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-0">
        <div className="p-3">
          <div className="mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-lightning me-2"></i>
              Quick Actions
            </h6>
            <Button
              variant="primary"
              size="sm"
              className="w-100 mb-2"
              onClick={() => setShowCreateBoardModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create Board
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              className="w-100"
              disabled
            >
              <i className="bi bi-search me-2"></i>
              Search Cards
            </Button>
          </div>

          <div className="mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-clock me-2"></i>
              Recent Boards
            </h6>
            <ListGroup variant="flush">
              {boards.map((board) => (
                <ListGroup.Item
                  action
                  className="border-0 py-2"
                  key={board.id}
                  active={board.id === boardId}
                  onClick={() => handleBoardSelect(board.id)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{board.title}</div>
                      <small className="text-muted">
                        {/* {board.totalCards}{" "}
                        {board.totalCards === 1 ? "card" : "cards"} */}
                        12 cards
                      </small>
                    </div>
                    <Badge bg="secondary" pill>
                      {/* {board.columns.length} */}4
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          <div className="mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-grid me-2"></i>
              Navigation
            </h6>
            <ListGroup variant="flush">
              <ListGroup.Item action className="border-0 py-2">
                <i className="bi bi-house me-3"></i>
                Dashboard
              </ListGroup.Item>

              <ListGroup.Item action className="border-0 py-2">
                <i className="bi bi-star me-3"></i>
                Starred Boards
              </ListGroup.Item>

              <ListGroup.Item action className="border-0 py-2">
                <i className="bi bi-person me-3"></i>
                Personal
              </ListGroup.Item>

              <ListGroup.Item action className="border-0 py-2">
                <i className="bi bi-briefcase me-3"></i>
                Work
              </ListGroup.Item>
            </ListGroup>
          </div>

          <div className="border-top pt-3">
            <ListGroup variant="flush">
              <ListGroup.Item action className="border-0 py-2">
                <i className="bi bi-box-arrow-right me-3"></i>
                Logout
              </ListGroup.Item>
            </ListGroup>
          </div>
        </div>
      </Offcanvas.Body>
      <AddBoardModal
        show={showCreateBoardModal}
        onHide={() => setShowCreateBoardModal(false)}
        onSave={handleCreateBoard}
      />
    </Offcanvas>
  );
}
