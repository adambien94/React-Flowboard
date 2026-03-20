import {
  Navbar as BSNavbar,
  Nav,
  Button,
  Container,
  ButtonGroup,
} from "react-bootstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

type NavbarProps = {
  onToggleDrawer?: () => void;
  isControlsHidden?: boolean;
};

export default function Navbar({
  onToggleDrawer,
  isControlsHidden = false,
}: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { boardId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isTableMode = location.pathname.startsWith("/summary/");

  const handleModeSwitch = (mode: "kanban" | "table") => {
    if (mode === "table") {
      if (!boardId || isTableMode) return;
      navigate(`/summary/${boardId}`);
      return;
    }

    if (isTableMode && boardId) {
      navigate(`/${boardId}`);
      return;
    }

    navigate("/");
  };

  return (
    <BSNavbar
      variant={theme === "dark" ? "dark" : "light"}
      expand="lg"
      className="fb-topbar"
    >
      <Container fluid className="px-2">
        <BSNavbar.Brand
          href="#"
          className="fw-semibold"
          style={{ fontSize: 15 }}
        >
          <i className="bi bi-kanban me-2"></i>
          Flowboard
        </BSNavbar.Brand>

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center flex-wrap gap-3">
            {!isControlsHidden && (
              <>
                <ButtonGroup
                  size="sm"
                  className="fb-view-switch"
                  aria-label="Board view mode switch"
                >
                  <Button
                    variant=""
                    className={
                      isTableMode
                        ? "btn btn-outline-secondary btn-sm"
                        : "fb-muted-btn btn btn-sm"
                    }
                    onClick={() => handleModeSwitch("kanban")}
                  >
                    <i className="bi bi-kanban me-1"></i>
                    Kanban Mode
                  </Button>
                  <Button
                    variant=""
                    className={
                      isTableMode
                        ? "fb-muted-btn btn btn-sm"
                        : "btn btn-outline-secondary btn-sm"
                    }
                    onClick={() => handleModeSwitch("table")}
                    disabled={!boardId}
                  >
                    <i className="bi bi-list me-1"></i>
                    Table Mode
                  </Button>
                </ButtonGroup>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={toggleTheme}
                  aria-label={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  title={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  <i
                    className={`bi ${theme === "dark" ? "bi-sun-fill" : "bi-moon-stars-fill"}`}
                  />
                </Button>
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
                <Button variant="outline-secondary" size="sm" className="">
                  <i className="bi bi-filter"></i> Filter
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={onToggleDrawer}
                >
                  <i className="bi bi-list"></i> Toggle Menu
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
