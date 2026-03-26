import { Button } from "react-bootstrap";
import { useUiStore } from "../../store/useUiStore";

const DashboardInitHeader = () => {
  const openCreateBoardModal = useUiStore(
    (state) => state.openCreateBoardModal,
  );

  return (
    <div
      className="text-center d-flex flex-column align-items-center justify-content-center"
      style={{ height: "90vh" }}
    >
      <h1 className="mb-4">Create your first Board !</h1>
      <Button
        size="lg"
        variant="outline-secondary"
        onClick={openCreateBoardModal}
      >
        <i className="bi bi-plus-circle me-3"></i>
        Create Board
      </Button>
    </div>
  );
};

export default DashboardInitHeader;
