import { useEffect, useRef, useState } from "react";
import "../styles/NoteModal.css";
import { LoadingIndicator } from "./LoadingIndicator";

const TITLE_MAX = 40;

export default function NoteModal({ note, saving, onClose, onSave }) {
  const [title, setTitle] = useState(note.title ?? "");
  const [content, setContent] = useState(note.content ?? "");
  const titleRef = useRef(null);

  useEffect(() => {
    // Lock background scroll while the dialog is open, close on Esc,
    // and autofocus the title once the modal has painted.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const focusTimer = setTimeout(() => {
      const el = titleRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(focusTimer);
    };
  }, [onClose]);

  const valid = title.trim() && content.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid || saving) return;
    onSave({ title: title.trim(), content: content.trim() });
  };

  return (
    <div
      className="modal"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__head">
          <span className="modal__head-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path
                d="M4 20h4l10-10a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5 4 20Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="modal__head-text">
            <h2 id="modal-title">Edit note</h2>
            <p>Polish your thoughts and save the changes.</p>
          </div>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </header>

        <form className="modal__form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">
              Title
              <span className="field__count">
                {title.length}/{TITLE_MAX}
              </span>
            </span>
            <span className="field__control">
              <input
                ref={titleRef}
                className="field__input"
                type="text"
                maxLength={TITLE_MAX}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                required
              />
            </span>
          </label>

          <label className="field">
            <span className="field__label">
              Content
              <span className="field__count">{content.length}</span>
            </span>
            <textarea
              className="field__textarea"
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts here…"
              required
            ></textarea>
          </label>

          <div className="modal__actions">
            <button
              type="button"
              className="modal__btn modal__btn--ghost"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal__btn modal__btn--primary"
              disabled={!valid || saving}
            >
              {saving ? <LoadingIndicator /> : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
