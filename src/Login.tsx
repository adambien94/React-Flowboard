import { useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import Navbar from "./components/Navbar";
import styles from "./components/DashboardLayout.module.css";
import { supabase } from "./api/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    setLoading(true);
    setError(null);

    const result = isRegister
      ? await supabase.auth.signUp({
          email,
          password,
        })
      : await supabase.auth.signInWithPassword({
          email,
          password,
        });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    navigate("/");
    setLoading(false);
  };

  return (
    <div>
      <Navbar isControlsHidden={true} />

      <div
        className={`${styles.mainContent} d-flex align-items-center justify-content-center`}
      >
        <Card style={{ width: 380 }}>
          <Card.Body>
            <h4 className="text-center mb-4">
              {isRegister ? "Create Account" : "Sign in"}
            </h4>

            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </Form.Group>

              {error && (
                <div className="text-danger text-center mb-3">{error}</div>
              )}

              <div className="d-grid gap-2">
                <Button onClick={handleAuth} disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" /> Loading...
                    </>
                  ) : isRegister ? (
                    "Register"
                  ) : (
                    "Login"
                  )}
                </Button>

                <Button
                  variant="outline-secondary"
                  onClick={() => setIsRegister((prev) => !prev)}
                >
                  {isRegister
                    ? "Already have an account?"
                    : "Create new account"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
