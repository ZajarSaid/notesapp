import { Link } from "react-router-dom";
import "../styles/NotFound.css";

export default function NotFound() {
  return (
    <main className="notfound">
      <div className="notfound__card">
        <p className="notfound__code" aria-hidden="true">
          404
        </p>
        <h1 className="notfound__title">This page drifted away</h1>
        <p className="notfound__text">
          The page you are looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back to your notes.
        </p>
        <div className="notfound__actions">
          <Link to="/home" className="notfound__btn notfound__btn--primary">
            Back to my notes
          </Link>
          <Link to="/login" className="notfound__btn notfound__btn--ghost">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
