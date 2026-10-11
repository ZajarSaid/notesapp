import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import { LoadingIndicator } from "./LoadingIndicator";

export default function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const data =
        method === "login"
          ? { username, password }
          : { username, password, email };

      const res = await api.post(route, data);
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/home");
      } else {
        navigate("/login");
      }
    } catch (error) {
      const data = error.response?.data;

      setErrorMsg(
        data?.username?.[0] ||
          data?.email?.[0] ||
          data?.detail ||
          "Something went wrong. Please try again.",
      );

      console.log(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      {errorMessage && (
        <div className="error-alert">
          <span>{errorMessage}</span>

          <button
            type="button"
            className="alert-close"
            onClick={() => setErrorMsg("")}
          >
            ×
          </button>
        </div>
      )}
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {method !== "login" && (
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      )}
      <div>
        <center>{loading && <LoadingIndicator />}</center>
      </div>
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}
