import React, { useState } from 'react';

function Lobby({ roomId, players, playerId, roomInfo, onStartGame, onLeave, socket }) {
  const [isReady, setIsReady] = useState(false);
  const currentPlayer = players.find(p => p.id === playerId);
  const isHost = currentPlayer?.isHost;
  const canStart = players.length >= 2;

  const handleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    socket.emit('player_ready', { isReady: newReadyState });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room code copied! Share with friends: ' + roomId);
  };

  return (
    <div className="lobby">
      <div className="lobby-container">
        <div className="lobby-header">
          <h2>🎮 Game Lobby</h2>
          <div className="room-code-card">
            <span className="room-code-label">Room Code:</span>
            <span className="room-code-value">{roomId}</span>
            <button onClick={copyRoomCode} className="copy-button">📋 Copy</button>
          </div>
        </div>
        
        <div className="players-list">
          <h3>👥 Players ({players.length}/8)</h3>
          {players.map(player => (
            <div key={player.id} className={`player-item ${player.id === playerId ? 'current-player' : ''}`}>
              <div className="player-info">
                <span className="player-name">
                  {player.id === playerId ? '👉 ' : ''}
                  {player.name}
                  {player.isHost && ' 👑'}
                </span>
                <span className="player-status">
                  {player.isReady ? '✅ Ready' : '⏳ Not ready'}
                </span>
              </div>
              <div className="player-stats">
                <span>💀 {player.kills || 0}</span>
                <span>⚰️ {player.deaths || 0}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lobby-actions">
          {!isHost && (
            <button onClick={handleReady} className={`ready-button ${isReady ? 'ready' : 'not-ready'}`}>
              {isReady ? '✅ READY' : '⏳ NOT READY'}
            </button>
          )}
          
          {isHost && (
            <>
              <button 
                onClick={onStartGame} 
                className={`start-button ${canStart ? 'active' : 'disabled'}`}
                disabled={!canStart}
              >
                {canStart ? '🚀 START GAME' : '⏰ WAITING FOR PLAYERS...'}
              </button>
              {!canStart && (
                <p className="waiting-message">Need at least 2 players to start</p>
              )}
            </>
          )}
          
          <button onClick={onLeave} className="leave-button">
            🚪 LEAVE LOBBY
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lobby;