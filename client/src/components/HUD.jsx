import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';

function HUD() {
  const { hp, kills, ammo } = useGameStore();
  const [scoreboardVisible, setScoreboardVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setScoreboardVisible(true);
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.key === 'Tab') {
        setScoreboardVisible(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <>
      <div className="hud">
        {/* Health Bar */}
        <div className="health-container">
          <div className="health-label">❤️ HEALTH</div>
          <div className="health-bar">
            <div className="health-fill" style={{ width: `${hp}%`, backgroundColor: hp > 50 ? '#4CAF50' : hp > 25 ? '#FF9800' : '#F44336' }} />
          </div>
          <div className="health-value">{hp}%</div>
        </div>
        
        {/* Weapon Info */}
        <div className="weapon-container">
          <div className="weapon-name">🔫 AK-47</div>
          <div className="ammo-count">{ammo} / 30</div>
          <div className="weapon-icon">⚡</div>
        </div>
        
        {/* Kills */}
        <div className="kills-container">
          <div className="kills-label">💀 KILLS</div>
          <div className="kills-value">{kills}</div>
        </div>
        
        {/* Crosshair */}
        <div className="crosshair">
          <div className="crosshair-line horizontal" />
          <div className="crosshair-line vertical" />
          <div className="crosshair-dot" />
        </div>
        
        {/* Instructions */}
        <div className="controls-hint">
          <span>WASD</span> Move &nbsp;&nbsp;|&nbsp;&nbsp;
          <span>MOUSE</span> Aim &nbsp;&nbsp;|&nbsp;&nbsp;
          <span>LEFT CLICK</span> Shoot &nbsp;&nbsp;|&nbsp;&nbsp;
          <span>TAB</span> Scoreboard
        </div>
      </div>
      
      {/* Scoreboard */}
      {scoreboardVisible && (
        <div className="scoreboard">
          <div className="scoreboard-header">
            <h2>📊 SCOREBOARD</h2>
            <div className="scoreboard-columns">
              <span>PLAYER</span>
              <span>KILLS</span>
              <span>DEATHS</span>
              <span>SCORE</span>
            </div>
          </div>
          <div className="scoreboard-players">
            {/* Здесь будут игроки из состояния игры */}
            <div className="scoreboard-player">
              <span>You</span>
              <span>{kills}</span>
              <span>0</span>
              <span>{kills * 100}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HUD;