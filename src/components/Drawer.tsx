import { useState } from "react";
import { Offcanvas, ListGroup, Button, Badge } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  const location = useLocation();
  const isTableMode = location.pathname.startsWith("/summary/");
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const { boards, addBoard, boardTaskCounts } = useBoardStore();
  const { logout } = useAuth();

  const handleBoardSelect = (targetBoardId: string) => {
    if (targetBoardId === boardId) {
      return;
    }
    navigate(isTableMode ? `/summary/${targetBoardId}` : `/${targetBoardId}`);
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
        <Offcanvas.Title className="fw-semibold fb-brand-title text ">
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
                  <i className="fb-nav-icon bi bi-x-diamond"></i>
                  <span className="flex-grow-1">{board.title}</span>
                  <Badge
                    className="custom-badge-color fb-board-count-badge"
                    pill
                  >
                    {boardTaskCounts[board.id] ?? 0}
                  </Badge>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="fb-section-label">Navigation</div>
          <ListGroup variant="flush">
            <ListGroup.Item action className="fb-nav-item" disabled>
              <i className="bi bi-house"></i>
              <span className="ms-2">Dashboard</span>
            </ListGroup.Item>
            <ListGroup.Item action className="fb-nav-item" disabled>
              <i className="bi bi-star"></i>
              <span className="ms-2">Starred</span>
            </ListGroup.Item>
            <ListGroup.Item action className="fb-nav-item" disabled>
              <i className="bi bi-person"></i>
              <span className="ms-2">Personal</span>
            </ListGroup.Item>
            <ListGroup.Item action className="fb-nav-item" disabled>
              <i className="fb-nav-icon bi bi-briefcase"></i>
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
