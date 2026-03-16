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
    <BSNavbar
      variant="dark"
      expand="lg"
      className="fb-topbar"
    >
      <Container fluid>
        <BSNavbar.Brand href="#" className="fw-semibold" style={{ fontSize: 15 }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--fb-accent)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              color: "white",
              marginRight: 10,
            }}
          >
            F
          </span>
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
