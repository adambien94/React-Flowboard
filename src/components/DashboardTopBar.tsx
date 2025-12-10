import { Dropdown, Button } from "react-bootstrap";
import { useBoardStore } from "../hooks/useBoardStore";
import { useNavigate, useParams } from "react-router-dom";

type DashboardTopBarParams = {
  openAddColumnModal: () => void;
};

const DashboardTopBar = ({ openAddColumnModal }: DashboardTopBarParams) => {
  const { boards, boardTitle } = useBoardStore();

  const { boardId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
            Boards
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {boards.map((board) => (
              <Dropdown.Item
                key={board.id}
                active={board.id === boardId}
                onClick={() => {
                  if (board.id === boardId) return;
                  navigate(`/${board.id}`);
                }}
              >
                {board.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <h3 className="fw-bold text-white ms-4 mt-2 fs-4">{boardTitle}</h3>
      </div>

      <Button variant="outline-secondary" onClick={openAddColumnModal}>
        <i className="bi bi-plus-circle"></i> Add column
      </Button>
    </div>
  );
};

export default DashboardTopBar;
