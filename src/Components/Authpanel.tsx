import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";

type AuthMode = "login" | "register" | "reset";

export default function AuthPanel() {
  const { signIn, register, resetPassword } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const result = await register(fullName, email, password);

        if (!result.success) {
          setError(result.message);
          return;
        }

        setMessage(result.message);
        setPassword("");
        setConfirmPassword("");
      } else if (mode === "login") {
        const result = await signIn(email, password);

        if (!result.success) {
          setError(result.message);
          return;
        }

        setMessage("Login successful. Welcome to SIMONIUM.");
        setPassword("");
      } else {
        const result = await resetPassword(email);

        if (!result.success) {
          setError(result.message);
          return;
        }

        setMessage(result.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const title =
    mode === "register"
      ? "Create your account"
      : mode === "reset"
        ? "Reset your password"
        : "Welcome back";

  const description =
    mode === "register"
      ? "Join SIMONIUM to connect knowledge and support discovery."
      : mode === "reset"
        ? "Enter your email to request password-reset instructions."
        : "Sign in to continue to SIMONIUM.";

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <div className="auth-logo" aria-hidden="true">
            S
          </div>

          <p className="auth-brand">SIMONIUM</p>

          <h1>{title}</h1>

          <p className="auth-description">{description}</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <div className="auth-field">
              <label htmlFor="auth-full-name">Full name</label>

              <input
                id="auth-full-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>

            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {mode !== "reset" && (
            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>

              <input
                id="auth-password"
                type="password"
                autoComplete={
                  mode === "register"
                    ? "new-password"
                    : "current-password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>
          )}

          {mode === "register" && (
            <div className="auth-field">
              <label htmlFor="auth-confirm-password">
                Confirm password
              </label>

              <input
                id="auth-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Enter your password again"
                minLength={8}
                required
              />
            </div>
          )}

          {error && (
            <div className="auth-message auth-error" role="alert">
              {error}
            </div>
          )}

          {message && (
            <div
              className="auth-message auth-success"
              role="status"
            >
              {message}
            </div>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "register"
                ? "Create Account"
                : mode === "reset"
                  ? "Request Reset"
                  : "Sign In"}
          </button>
        </form>

        <nav className="auth-links" aria-label="Account options">
          {mode === "login" && (
            <>
              <button
                type="button"
                onClick={() => changeMode("reset")}
              >
                Forgot password?
              </button>

              <p>
                New to SIMONIUM?{" "}
                <button
                  type="button"
                  onClick={() => changeMode("register")}
                >
                  Create an account
                </button>
              </p>
            </>
          )}

          {mode === "register" && (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => changeMode("login")}
              >
                Sign in
              </button>
            </p>
          )}

          {mode === "reset" && (
            <button
              type="button"
              onClick={() => changeMode("login")}
            >
              Back to sign in
            </button>
          )}
        </nav>

        <footer className="auth-footer">
          Connecting knowledge. Enabling discovery.
        </footer>
      </section>
    </main>
  );
}
