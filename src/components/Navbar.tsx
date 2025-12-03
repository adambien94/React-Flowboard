import { Navbar as BSNavbar, Nav, Button, Container } from "react-bootstrap";

interface NavbarProps {
  onToggleDrawer: () => void;
}

export default function Navbar({ onToggleDrawer }: NavbarProps) {
  return (
    <BSNavbar
      variant="dark"
      expand="lg"
      className="shadow-lg"
      style={{ backgroundColor: "#1b1b23" }}
    >
      <Container fluid>
        <BSNavbar.Brand href="#" className="fw-bold fs-4">
          <i className="bi bi-kanban me-2"></i>
          Flowboard
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onToggleDrawer}
              className="ms-2"
            >
              <i className="bi bi-list"></i> Menu
            </Button>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
