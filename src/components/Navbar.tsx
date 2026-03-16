import { Navbar as BSNavbar, Nav, Button, Container } from "react-bootstrap";

type NavbarProps = {
  onToggleDrawer?: () => void;
  isControlsHidden?: boolean;
};

export default function Navbar({
  onToggleDrawer,
  isControlsHidden = false,
}: NavbarProps) {
  return (
    <BSNavbar variant="dark" expand="lg" className="fb-topbar">
      <Container fluid>
        <BSNavbar.Brand
          href="#"
          className="fw-semibold"
          style={{ fontSize: 15 }}
        >
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
