import { Navbar as BSNavbar, Nav, Button, Container } from "react-bootstrap";

interface NavbarProps {
  onToggleDrawer?: () => void;
  isControlsHidden?: boolean;
}

export default function Navbar({
  onToggleDrawer,
  isControlsHidden = false,
}: NavbarProps) {
  return (
    <BSNavbar
      variant="dark"
      expand="lg"
      className="shadow-lg border-bottom"
      style={{ backgroundColor: "#1c1d27" }}
    >
      <Container fluid>
        <BSNavbar.Brand href="#" className="fw-bold fs-4">
          <i className="bi bi-kanban me-2"></i>
          Flowboard
        </BSNavbar.Brand>

        {!isControlsHidden && (
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
        )}
      </Container>
    </BSNavbar>
  );
}
