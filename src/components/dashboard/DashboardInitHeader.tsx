import { Button } from "react-bootstrap";
import { useState } from "react";
import AddBoardModal from "../AddBoardModal";
import { useBoardStore } from "../../hooks/useBoardStore";

const DashboardInitHeader = () => {
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const addBoard = useBoardStore((state) => state.addBoard);

  return (
    <div
      className="text-center d-flex flex-column align-items-center justify-content-center"
      style={{ height: "90vh" }}
    >
      <h1 className="mb-4">Create your first Board !</h1>
      <Button
        size="lg"
        variant="outline-secondary"
        onClick={() => setShowCreateBoardModal(true)}
      >
        <i className="bi bi-plus-circle me-3"></i>
        Create Board
      </Button>

      <AddBoardModal
        show={showCreateBoardModal}
        onHide={() => setShowCreateBoardModal(false)}
        onSave={async (title) => {
          await addBoard(title);
          setShowCreateBoardModal(false);
        }}
      />
    </div>
  );
};

export default DashboardInitHeader;
