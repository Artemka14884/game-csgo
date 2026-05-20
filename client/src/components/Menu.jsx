import React, { useState, useEffect } from 'react';

function Menu({ onCreateRoom, onJoinRoom, socket }) {
  const [playerName, setPlayerName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');

  useEffect(() => {
    if (socket) {
      socket.emit('get_rooms');
      
      socket.on('rooms_list', (roomsList) => {
        setRooms(roomsList);
      });
      
      socket.on('rooms_update', (roomsList) => {
        setRooms(roomsList);
      });
    }
    
    return () => {
      if (socket) {
        socket.off('rooms_list');
        socket.off('rooms_update');
      }
    };
  }, [socket]);

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

  const handleJoinExisting = (roomId) => {
    if (playerName.trim()) {
      onJoinRoom(roomId, playerName);
    } else {
      alert('Please enter your name first');
    }
  };

  return (
    <div className="menu">
      <div className="menu-container">
        <h1 className="game-title">🔫 CS2 ONLINE</h1>
        <p className="game-subtitle">Browser FPS | Multiplayer PvP</p>
        
        <input
          type="text"
          placeholder="Enter your nickname"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="menu-input"
          maxLength={20}
        />
        
        <button onClick={handleCreate} className="menu-button primary">
          🏠 CREATE NEW ROOM
        </button>
        
        <div className="menu-divider">OR</div>
        
        <div className="join-section">
          <input
            type="text"
            placeholder="Enter room code (e.g., ABC123)"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
            className="menu-input"
            maxLength={6}
          />
          <button onClick={handleJoin} className="menu-button secondary">
            🔑 JOIN ROOM
          </button>
        </div>
        
        <button 
          onClick={() => setShowRooms(!showRooms)} 
          className="menu-button ghost"
        >
          📋 {showRooms ? 'HIDE' : 'SHOW'} PUBLIC ROOMS ({rooms.length})
        </button>
        
        {showRooms && (
          <div className="rooms-list">
            <h3>📡 Available Rooms</h3>
            {rooms.length === 0 ? (
              <p className="no-rooms">No rooms yet. Create one!</p>
            ) : (
              rooms.map(room => (
                <div key={room.id} className="room-item">
                  <div className="room-info">
                    <span className="room-id">🔐 {room.id}</span>
                    <span className="room-players">👥 {room.playerCount}/{room.maxPlayers}</span>
                    <span className="room-host">👑 {room.hostName || 'Host'}</span>
                  </div>
                  {room.playerCount < room.maxPlayers && !room.hasGame && (
                    <button 
                      onClick={() => handleJoinExisting(room.id)}
                      className="join-room-button"
                      disabled={!playerName}
                    >
                      JOIN
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;