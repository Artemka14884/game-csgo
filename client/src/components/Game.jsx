import React, { useEffect, useRef, useState } from 'react';
import { GameController } from '../game/GameController.js';
import HUD from './HUD.jsx';

function Game({ roomId, playerId, socket, onLeave }) {
  const containerRef = useRef(null);
  const gameControllerRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (containerRef.current && !gameControllerRef.current) {
      gameControllerRef.current = new GameController(
        containerRef.current,
        socket,
        playerId
      );
      gameControllerRef.current.init();
    }

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setShowMenu(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (gameControllerRef.current) {
        gameControllerRef.current.dispose();
      }
    };
  }, [socket, playerId]);

  return (
    <div className="game-container">
      <div ref={containerRef} className="canvas-container" />
      <HUD />
      
      <button onClick={onLeave} className="exit-game-button">
        🚪 EXIT GAME
      </button>
      
      {showMenu && (
        <div className="game-menu-overlay">
          <div className="game-menu">
            <h3>Game Menu</h3>
            <button onClick={() => setShowMenu(false)}>Resume Game</button>
            <button onClick={onLeave}>Leave Match</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;