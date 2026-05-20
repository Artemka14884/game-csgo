import React, { useEffect, useRef } from 'react';
import { GameController } from '../game/GameController';
import HUD from './HUD';

function Game({ roomId, playerId, network, onLeave }) {
  const containerRef = useRef(null);
  const gameControllerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !gameControllerRef.current) {
      gameControllerRef.current = new GameController(
        containerRef.current,
        network,
        playerId
      );
      gameControllerRef.current.init();
    }

    return () => {
      if (gameControllerRef.current) {
        gameControllerRef.current.dispose();
      }
    };
  }, [network, playerId]);

  return (
    <div className="game-container">
      <div ref={containerRef} className="canvas-container" />
      <HUD />
      <button onClick={onLeave} className="exit-game-button">
        ESC - Menu
      </button>
    </div>
  );
}

export default Game;