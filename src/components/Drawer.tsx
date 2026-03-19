import { useState } from "react";
import { Offcanvas, ListGroup, Button, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import AddBoardModal from "./AddBoardModal";
import { useBoardStore } from "../hooks/useBoardStore";
import { useAuth } from "../contexts/AuthContext";

type DrawerProps = {
  show: boolean;
  onHide: () => void;
};

export default function Drawer({ show, onHide }: DrawerProps) {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const { boards, addBoard } = useBoardStore();
  const { logout } = useAuth();

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
      className="shadow-none fb-sidebar"
      data-bs-theme="dark"
      keyboard={false}
    >
      <Offcanvas.Header className="border-bottom">
        <Offcanvas.Title className="fw-semibold fb-brand-title">
          <i className="bi bi-kanban me-2"></i>
          Flowboard
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-0 d-flex flex-column">
        <div className="px-2 pt-3">
          <Button
            className="w-100 fb-primary-btn"
            size="sm"
            onClick={() => setShowCreateBoardModal(true)}
          >
            + New board
          </Button>
        </div>

        <div className="px-2">
          <div className="fb-section-label">Boards</div>
          <ListGroup variant="flush">
            {boards.map((board) => (
              <ListGroup.Item
                action
                className="fb-nav-item"
                key={board.id}
                active={board.id === boardId}
                onClick={() => handleBoardSelect(board.id)}
              >
                <div className="d-flex align-items-center gap-2">
                  <span className="fb-nav-icon">◈</span>
                  <span className="flex-grow-1">{board.title}</span>
                  <Badge
                    className="custom-badge-color fb-board-count-badge"
                    pill
                  >
                    12
                  </Badge>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="fb-section-label">Navigation</div>
          <ListGroup variant="flush">
            <ListGroup.Item action className="fb-nav-item" disabled>
              <span className="fb-nav-icon">⊞</span>
              <span className="ms-2">Dashboard</span>
            </ListGroup.Item>
            <ListGroup.Item action className="fb-nav-item" disabled>
              <span className="fb-nav-icon">☆</span>
              <span className="ms-2">Starred</span>
            </ListGroup.Item>
            <ListGroup.Item action className="fb-nav-item" disabled>
              <span className="fb-nav-icon">◯</span>
              <span className="ms-2">Personal</span>
            </ListGroup.Item>
            <ListGroup.Item action className="fb-nav-item" disabled>
              <span className="fb-nav-icon">◻</span>
              <span className="ms-2">Work</span>
            </ListGroup.Item>
          </ListGroup>
        </div>

        <div className="mt-auto px-2 py-2 fb-sidebar-footer">
          <ListGroup variant="flush">
            <ListGroup.Item
              action
              className="fb-nav-item fb-logout-item"
              onClick={logout}
            >
              <span className="fb-nav-icon">↪</span>
              <span className="ms-2">Logout</span>
            </ListGroup.Item>
          </ListGroup>
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
