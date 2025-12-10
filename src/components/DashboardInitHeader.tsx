import { Button } from "react-bootstrap";

const DashboardInitHeader = () => {
  return (
    <div className="text-center">
      <h1 className="mt-5 mb-4">Create your first Board !</h1>
      <Button size="lg" variant="outline-secondary">
        <i className="bi bi-plus-circle me-3"></i>
        Create Board
      </Button>
    </div>
  );
};

export default DashboardInitHeader;
