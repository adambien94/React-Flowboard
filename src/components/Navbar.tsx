import {
  Navbar as BSNavbar,
  Nav,
  NavDropdown,
  Button,
  Container,
} from "react-bootstrap";

interface NavbarProps {
  onToggleDrawer: () => void;
}

export default function Navbar({ onToggleDrawer }: NavbarProps) {
  return (
    <BSNavbar
      variant="dark"
      expand="lg"
      className="shadow-lg"
      style={{ backgroundColor: "#192445" }}
    >
      <Container fluid>
        <BSNavbar.Brand href="#" className="fw-bold fs-4">
          <i className="bi bi-kanban me-2"></i>
          Flowboard
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown
              title="Jan Kowalski"
              id="boards-dropdown"
              className="mx-2"
              drop="down"
              align="end"
            >
              <NavDropdown.Item href="#action/1">Mój profil</NavDropdown.Item>
              <NavDropdown.Item href="#action/1">Yolo</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/2">Wyloguj się</NavDropdown.Item>
            </NavDropdown>

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
