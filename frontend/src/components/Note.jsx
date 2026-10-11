import "../styles/Note.css";

/* Pastel accents cycled across the grid so the wall of notes feels
   lively without the user choosing colours. */
const ACCENTS = [
  "#7c5cff",
  "#22d3ee",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#6366f1",
];

export default function Note({ note, index = 0, onDelete, onEdit }) {
  const accent = ACCENTS[index % ACCENTS.length];

  // The API serializer does not always expose created_at; guard so we
  // never render an "Invalid Date".
  const hasDate = Boolean(note.created_at);
  const formattedDate = hasDate
    ? new Date(note.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // "Edited" marker: modified_at is bumped on save, so a noticeable gap
  // between the two timestamps means the note has been changed.
  const isEdited =
    Boolean(note.created_at && note.modified_at) &&
    new Date(note.modified_at).getTime() -
      new Date(note.created_at).getTime() >
      1000;

  const initial = (note.title || "?").trim().charAt(0).toUpperCase();

  return (
    <article className="note-card" style={{ "--accent": accent }}>
      <div className="note-card__top">
        <span className="note-card__badge" aria-hidden="true">
          {initial}
        </span>

        <div className="note-card__actions">
          <button
            type="button"
            className="note-card__action note-card__edit"
            onClick={() => onEdit(note)}
            aria-label={`Edit note ${note.title}`}
            title="Edit note"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
              <path
                d="M4 20h4l10-10a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5 4 20Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="note-card__action note-card__delete"
            onClick={() => onDelete(note.id)}
            aria-label={`Delete note ${note.title}`}
            title="Delete note"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
              <path
                d="M4 7h16M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7M6.5 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="note-card__title">{note.title}</h3>
      <p className="note-card__content">{note.content}</p>

      {hasDate && (
        <footer className="note-card__foot">
          <span className="note-card__date">{formattedDate}</span>
          {isEdited && <span className="note-card__edited">· Edited</span>}
        </footer>
      )}
    </article>
  );
}
