import React, { useState } from 'react';

function Menu({ onCreateRoom, onJoinRoom }) {
  const [playerName, setPlayerName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [showJoin, setShowJoin] = useState(false);

  const handleCreate = () => {
    if (playerName.trim()) {
      onCreateRoom(playerName);
    } else {
      alert('Please enter your name');
    }
  };

  const handleJoin = () => {
    if (playerName.trim() && joinRoomId.trim()) {
      onJoinRoom(joinRoomId.toUpperCase(), playerName);
    } else {
      alert('Please enter name and room code');
    }
  };

  return (
    <div className="menu">
      <div className="menu-container">
        <h1 className="game-title">CS2 ONLINE</h1>
        <div className="menu-buttons">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="menu-input"
          />
          
          {!showJoin ? (
            <>
              <button onClick={handleCreate} className="menu-button">
                CREATE ROOM
              </button>
              <button onClick={() => setShowJoin(true)} className="menu-button secondary">
                JOIN ROOM
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Room code"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                className="menu-input"
              />
              <button onClick={handleJoin} className="menu-button">
                JOIN
              </button>
              <button onClick={() => setShowJoin(false)} className="menu-button secondary">
                BACK
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Menu;