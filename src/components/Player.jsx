import { useState } from "react";

export default function Player({ initialName, symbol }) {
  const [isEditing, setIsEditing] = useState(false);
  const [playerName, setNewName] = useState(initialName);

  let editablePlayerName = <span className="player-name">{playerName}</span>;

  if (isEditing) {
    editablePlayerName = (
      <input
        onChange={(event) => setNewName(event.target.value)}
        required
        type="text"
        value={playerName}
      />
    );
  }

  function handleEditClick() {
    // Arrow fn is preferred way to update value of state var
    setIsEditing((editing) => !editing);
  }

  return (
    <li>
      <span className="player">
        {editablePlayerName}
        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}:</button>
    </li>
  );
}
