import { useState, type FormEvent } from "react";
import { Spinner } from "react-bootstrap";
import Navbar from "./components/Navbar";
import styles from "./components/dashboard/DashboardLayout.module.css";
import { supabase } from "./api/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (event: FormEvent) => {
    event.preventDefault();
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
        <div className="fb-auth-card">
          <div className="fb-modal-header">
            <span className="fb-modal-title">
              {isRegister ? "Create account" : "Sign in"}
            </span>
          </div>

          <form onSubmit={handleAuth}>
            <div className="fb-modal-body">
              <div className="fb-field">
                <div className="fb-field-label">Email</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter e-mail"
                  className="fb-field-control"
                  required
                />
              </div>

              <div className="fb-field">
                <div className="fb-field-label">Password</div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="fb-field-control"
                  required
                />
              </div>

              {error && (
                <div className="fb-auth-error text-center">{error}</div>
              )}
            </div>

            <div className="fb-modal-footer fb-auth-footer">
              <button
                type="submit"
                className="fb-btn fb-btn-primary fb-auth-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" /> Loading...
                  </>
                ) : isRegister ? (
                  "Register"
                ) : (
                  "Login"
                )}
              </button>

              <button
                type="button"
                className="fb-btn fb-btn-ghost fb-auth-secondary"
                onClick={() => setIsRegister((prev) => !prev)}
              >
                {isRegister ? "Already have an account?" : "Create new account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
