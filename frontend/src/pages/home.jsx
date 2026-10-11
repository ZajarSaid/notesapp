import { useEffect, useRef, useState } from "react";
import api from "../api";
import Note from "../components/Note";
import Toast from "../components/Toast";
import "../styles/Home.css";
import { LoadingIndicator } from "../components/LoadingIndicator";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(message, type = "success") {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    getNotes();
  }, []);

  async function getNotes() {
    try {
      setLoading(true);
      const response = await api.get("notes/");
      if (response) {
        setNotes(response.data);
        console.log(response.data);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  async function deleteNotes(id) {
    try {
      const response = await api.delete(`notes/delete/${id}/`);
      if (response.status === 204) showToast("Note deleted", "success");
      else showToast("Failed to delete a note", "error");
      await getNotes();
    } catch (error) {
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      console.error("Message:", error.message);
      showToast("Failed to delete a note", "error");
    }
  }

  // async function createNote() {
  //   try {
  //     const response = api.post("notes/", { content, title });
  //     console.log("Note created:", response.data);
  //   } catch (error) {
  //     console.log("Status:", error.response?.status);
  //     console.log("Error details:", error.response?.data);
  //   }
  // }
  const createNote = (e) => {
    e.preventDefault();
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
      });
  };

  return (
    <div>
      <div>
        <h1>Notes</h1>
        {notes && notes.length > 0
          ? notes.map((note) => (
              <Note key={note.title} note={note} onDelete={deleteNotes} />
            ))
          : null}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />{" "}
        <br />
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="content"
          value={content}
          required
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit" />
      </form>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
