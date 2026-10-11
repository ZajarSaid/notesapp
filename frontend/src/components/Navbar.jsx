import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function NoteLogo() {
  return (
    <span className="navbar__logo" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
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
    </span>
  );
}

export default function Navbar({ username }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // The /logout route lives in App.jsx; it clears localStorage and
    // redirects to /login. We simply route the click there.
    navigate("/logout");
  };

  const initial = (username || "?").trim().charAt(0).toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <NoteLogo />
          <span className="navbar__name">Notes</span>
        </div>

        <div className="navbar__actions">
          <span className="navbar__user" title={username || "Guest"}>
            <span className="navbar__avatar">{initial}</span>
            <span className="navbar__username">{username || "Guest"}</span>
          </span>

          <button
            type="button"
            className="navbar__logout"
            onClick={handleLogout}
          >
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="navbar__logout-label">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
