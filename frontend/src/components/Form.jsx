import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import { LoadingIndicator } from "./LoadingIndicator";

/* ---- tiny inline icons (no icon library needed) -------------------- */
const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
    <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M5.5 19.5a6.5 6.5 0 0 1 13 0"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
    <rect
      x="5"
      y="10.5"
      width="14"
      height="9.5"
      rx="2.2"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
    <rect
      x="4"
      y="6"
      width="16"
      height="12"
      rx="2.2"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="m5.5 7.5 6.5 5 6.5-5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M4 4.5 20 19.5M9.6 9.7a3 3 0 0 0 4.2 4.2M6.2 6.4C3.9 8 2.5 12 2.5 12S6 18.5 12 18.5c1.5 0 2.8-.4 3.9-1M11 5.6a9.7 9.7 0 0 1 1-.1c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.7 3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

export default function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isLogin = method === "login";
  const name = isLogin ? "Login" : "Create account";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const data = isLogin
        ? { username, password }
        : { username, password, email };

      const res = await api.post(route, data);
      if (isLogin) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        // Persist the username so the home page can greet the user
        // (the JWT payload itself doesn't carry it).
        localStorage.setItem("username", username);
        navigate("/home");
      } else {
        navigate("/login");
      }
    } catch (error) {
      const data = error.response?.data;
      setErrorMsg(
        data?.username?.[0] ||
          data?.email?.[0] ||
          data?.password?.[0] ||
          data?.detail ||
          "Something went wrong. Please try again.",
      );
      console.log(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <section className="auth__card">
        {/* Brand / marketing panel — collapses on narrow screens */}
        <aside className="auth__aside">
          <div className="auth__aside-glow" aria-hidden="true" />
          <div className="auth__aside-logo">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path
                d="M6 3.5h9.5L19 7v13.5H6z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M9 9h7M9 12.5h7M9 16h4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="auth__aside-title">Notes</h2>
          <p className="auth__aside-text">
            A calm, beautiful space to capture your ideas before they slip
            away.
          </p>
          <ul className="auth__features">
            <li>
              <span className="auth__tick" aria-hidden="true">
                ✓
              </span>
              Instantly write and organise notes
            </li>
            <li>
              <span className="auth__tick" aria-hidden="true">
                ✓
              </span>
              Private to your account
            </li>
            <li>
              <span className="auth__tick" aria-hidden="true">
                ✓
              </span>
              Works beautifully on any screen
            </li>
          </ul>
        </aside>

        {/* The actual form panel */}
        <div className="auth__form-panel">
          <header className="auth__header">
            <div className="auth__badge" aria-hidden="true">
              {isLogin ? "Welcome back" : "Get started"}
            </div>
            <h1 className="auth__title">{name}</h1>
            <p className="auth__subtitle">
              {isLogin
                ? "Sign in to pick up where you left off."
                : "Create your account in a few seconds."}
            </p>
          </header>

          {errorMessage && (
            <div className="error-alert" role="alert">
              <span>{errorMessage}</span>
              <button
                type="button"
                className="alert-close"
                onClick={() => setErrorMsg("")}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth__form" noValidate>
            <label className="field">
              <span className="field__label">Username</span>
              <span className="field__control">
                <span className="field__icon">
                  <UserIcon />
                </span>
                <input
                  className="field__input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. john_doe"
                  autoComplete="username"
                  required
                />
              </span>
            </label>

            {!isLogin && (
              <label className="field">
                <span className="field__label">Email</span>
                <span className="field__control">
                  <span className="field__icon">
                    <MailIcon />
                  </span>
                  <input
                    className="field__input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </span>
              </label>
            )}

            <label className="field">
              <span className="field__label">Password</span>
              <span className="field__control">
                <span className="field__icon">
                  <LockIcon />
                </span>
                <input
                  className="field__input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </span>
            </label>

            <button
              className="form-button"
              type="submit"
              disabled={loading}
            >
              {loading ? <LoadingIndicator /> : <span>{name}</span>}
            </button>
          </form>

          <p className="auth__switch">
            {isLogin ? (
              <>
                New here?{" "}
                <Link to="/register">Create an account</Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/login">Log in</Link>
              </>
            )}
          </p>
        </div>
      </section>
    </main>
  );
}
