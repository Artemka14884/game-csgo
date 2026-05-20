import React from 'react';

function Lobby({ roomId, players, playerId, onStartGame, onLeave }) {
  const currentPlayer = players.find(p => p.id === playerId);
  const isHost = currentPlayer?.isHost;

  return (
    <div className="lobby">
      <div className="lobby-container">
        <div className="lobby-header">
          <h2>Game Lobby</h2>
          <div className="room-code">
            Room Code: <span>{roomId}</span>
          </div>
        </div>
        
        <div className="players-list">
          <h3>Players ({players.length}/8)</h3>
          {players.map(player => (
            <div key={player.id} className="player-item">
              <span className="player-name">
                {player.name}
                {player.isHost && ' 👑'}
                {player.id === playerId && ' (You)'}
              </span>
              <span className="player-stats">
                K: {player.kills} D: {player.deaths}
              </span>
            </div>
          ))}
        </div>
        
        <div className="lobby-actions">
          {isHost && players.length >= 2 && (
            <button onClick={onStartGame} className="start-button">
              START GAME
            </button>
          )}
          {isHost && players.length < 2 && (
            <div className="waiting-message">
              Waiting for at least 2 players...
            </div>
          )}
          <button onClick={onLeave} className="leave-button">
            LEAVE LOBBY
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lobby;