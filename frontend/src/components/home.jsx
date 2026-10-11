import { useState, useEffect } from "react";
import api from "../api";

export default function NameHandler() {
  const [name, setName] = useState("");

  const handleName = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <div>
        <h1>Name here</h1>
        <input type="text" value={name} onChange={handleName}></input>
      </div>
      <div>Display name: {name}</div>
    </div>
  );
}
