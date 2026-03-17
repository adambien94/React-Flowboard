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
      <Container fluid className="px-2">
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
              <div className="avatar-group d-flex">
                <div className="avatar" style={{ background: "#6c63ff" }}>
                  AB
                </div>
                <div className="avatar" style={{ background: "#3ecf8e" }}>
                  KL
                </div>
                <div className="avatar" style={{ background: "#f5a623" }}>
                  MR
                </div>
              </div>
              <Button variant="outline-secondary" size="sm" className="ms-3">
                <i className="bi bi-filter"></i> Filter
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={onToggleDrawer}
                className="ms-3"
              >
                <i className="bi bi-list"></i> Toggle Menu
              </Button>
            </Nav>
          </BSNavbar.Collapse>
        )}
      </Container>
    </BSNavbar>
  );
}
