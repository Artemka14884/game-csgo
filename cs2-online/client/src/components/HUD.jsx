import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

function HUD() {
  const { hp, kills, ammo } = useGameStore();

  return (
    <div className="hud">
      <div className="health-bar">
        <div className="health-fill" style={{ width: `${hp}%` }} />
        <span className="health-text">❤️ {hp}</span>
      </div>
      
      <div className="weapon-info">
        <span className="ammo-count">🔫 {ammo}/30</span>
        <span className="kills-count">⚔️ Kills: {kills}</span>
      </div>
      
      <div className="crosshair">
        <div className="crosshair-line horizontal" />
        <div className="crosshair-line vertical" />
      </div>
    </div>
  );
}

export default HUD;