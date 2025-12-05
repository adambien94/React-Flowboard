import { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import Navbar from "./components/Navbar";
import styles from "./components/DashboardLayout.module.css";
// import { useAuthStore } from "./store/authStore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // const { signIn, signUp } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signIn(email, password);
      navigate("/"); // po zalogowaniu
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);
      await signUp(email, password);
      navigate("/"); // po rejestracji
    } catch (err: any) {
      setError(err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar isControlsHidden={true} />

      <div className={styles.mainContent} style={{ display: "flex" }}>
        <Container className="d-flex justify-content-center align-items-center">
          <Card style={{ width: 360 }}>
            <Card.Body>
              <h4 className="text-center mb-4">Sign in</h4>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button
                  className="w-100"
                  variant="primary"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <Button
                  className="w-100 my-3"
                  variant="outline-secondary"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Register"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}
