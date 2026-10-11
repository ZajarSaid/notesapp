import "../styles/Toast.css";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`} role="status">
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close">
        &times;
      </button>
    </div>
  );
}
