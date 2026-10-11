import "../styles/Toast.css";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M5 12.5 10 17.5 19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      className={`toast toast--${isError ? "error" : "success"}`}
      role="status"
      aria-live="polite"
    >
      <span className="toast__icon">{isError ? <XIcon /> : <CheckIcon />}</span>
      <span className="toast__message">{toast.message}</span>
      <button
        className="toast__close"
        onClick={onClose}
        aria-label="Close notification"
      >
        &times;
      </button>
      <span className="toast__progress" aria-hidden="true" />
    </div>
  );
}
