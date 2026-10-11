import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api";
import Note from "../components/Note";
import NoteModal from "../components/NoteModal";
import Toast from "../components/Toast";
import Navbar from "../components/Navbar";
import "../styles/Home.css";
import { LoadingIndicator } from "../components/LoadingIndicator";

const TITLE_MAX = 40;

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const username = localStorage.getItem("username") || "there";

  const showToast = useCallback((message, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const getNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("notes/");
      if (response) {
        setNotes(response.data);
      }
    } catch (e) {
      console.log(e);
      showToast("Could not load your notes", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // Initial fetch on mount; getNotes updates state after the request
    // resolves (async), so this is not a synchronous render cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getNotes();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [getNotes]);

  async function deleteNotes(id) {
    try {
      const response = await api.delete(`notes/delete/${id}/`);
      if (response.status === 204) {
        showToast("Note deleted", "success");
        // Optimistic removal keeps the grid snappy, then we resync.
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } else {
        showToast("Failed to delete a note", "error");
      }
      await getNotes();
    } catch (error) {
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      console.error("Message:", error.message);
      showToast("Failed to delete a note", "error");
    }
  }

  const createNote = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setCreating(true);
    api
      .post("notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          showToast("Note created", "success");
          setTitle("");
          setContent("");
        } else {
          showToast("Failed to make note", "error");
        }
        getNotes();
      })
      .catch((err) => {
        console.log("Django response:", err.response?.data);
        showToast("Failed to make note", "error");
      })
      .finally(() => setCreating(false));
  };

  const openEdit = (note) => setEditing(note);

  async function updateNote(values) {
    if (!editing) return;
    setSavingEdit(true);
    try {
      // PATCH updates only the provided fields (title/content); the
      // author and timestamps stay server-managed.
      const res = await api.patch(`notes/update/${editing.id}/`, values);
      if (res.status === 200) {
        showToast("Note updated", "success");
        setEditing(null);
        await getNotes();
      } else {
        showToast("Failed to update note", "error");
      }
    } catch (error) {
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      showToast("Failed to update note", "error");
    } finally {
      setSavingEdit(false);
    }
  }

  const total = notes.length;
  const canSubmit = title.trim() && content.trim() && !creating;

  return (
    <div className="home">
      <Navbar username={username} />

      <main className="home__main">
        <header className="home__hero">
          <div className="home__hero-text">
            <p className="home__eyebrow">Your workspace</p>
            <h1 className="home__greeting">Welcome back, {username}</h1>
            <p className="home__lede">
              Capture a thought before it slips away, and keep every idea in one
              serene place.
            </p>
          </div>

          <div className="home__stats">
            <div className="stat">
              <span className="stat__value">{total}</span>
              <span className="stat__label">
                {total === 1 ? "Note" : "Notes"}
              </span>
            </div>
          </div>
        </header>

        <div className="home__grid">
          {/* ---------------- Composer ---------------- */}
          <section className="composer" aria-labelledby="composer-title">
            <div className="composer__head">
              <span className="composer__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div>
                <h2 id="composer-title">New note</h2>
                <p>What&apos;s on your mind?</p>
              </div>
            </div>

            <form className="composer__form" onSubmit={createNote}>
              <label className="field">
                <span className="field__label">
                  Title
                  <span className="field__count">
                    {title.length}/{TITLE_MAX}
                  </span>
                </span>
                <span className="field__control">
                  <input
                    className="field__input"
                    type="text"
                    id="title"
                    name="title"
                    maxLength={TITLE_MAX}
                    placeholder="Give it a short, catchy title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </span>
              </label>

              <label className="field">
                <span className="field__label">
                  Content
                  <span className="field__count">
                    {content.length}
                  </span>
                </span>
                <textarea
                  className="field__textarea"
                  name="content"
                  id="content"
                  rows={6}
                  placeholder="Write your thoughts here…"
                  required
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
                ></textarea>
              </label>

              <button
                className="composer__submit"
                type="submit"
                disabled={!canSubmit}
              >
                {creating ? (
                  <LoadingIndicator />
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12h13M12 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Save note
                  </>
                )}
              </button>
            </form>
          </section>

          {/* ---------------- Notes ---------------- */}
          <section className="notes" aria-labelledby="notes-title">
            <div className="notes__head">
              <h2 id="notes-title">Your notes</h2>
              {total > 0 && (
                <span className="notes__pill">
                  {total} {total === 1 ? "note" : "notes"}
                </span>
              )}
            </div>

            {loading ? (
              <div className="notes__grid" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div className="skeleton" key={i}>
                    <div className="skeleton__line skeleton__line--title" />
                    <div className="skeleton__line" />
                    <div className="skeleton__line skeleton__line--short" />
                  </div>
                ))}
              </div>
            ) : total === 0 ? (
              <div className="empty">
                <div className="empty__art" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="none">
                    <path
                      d="M6 3.5h9.5L19 7v13.5H6z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 9h7M9 12.5h7M9 16h4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3>No notes yet</h3>
                <p>
                  Your ideas will appear here. Use the composer to write your
                  very first note.
                </p>
              </div>
            ) : (
              <div className="notes__grid">
                {notes.map((note, index) => (
                  <Note
                    key={note.id}
                    note={note}
                    index={index}
                    onDelete={deleteNotes}
                    onEdit={openEdit}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {editing && (
        <NoteModal
          note={editing}
          saving={savingEdit}
          onClose={() => setEditing(null)}
          onSave={updateNote}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
