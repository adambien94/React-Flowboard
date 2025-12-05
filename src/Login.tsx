import { useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { supabase } from "./api/supabaseClient";
import Navbar from "./components/Navbar";
import styles from "./components/DashboardLayout.module.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/"); // albo np. /dashboard
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar isControlsHidden={true} />

      <div
        className={`${styles.mainContent} d-flex align-items-center justify-content-center`}
      >
        <Card style={{ width: 420 }}>
          <Card.Body>
            <h4 className="mb-4 text-center">Sign in</h4>

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {error && (
                <div className="text-danger text-center mb-3">{error}</div>
              )}

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Login"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
