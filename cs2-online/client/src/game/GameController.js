import * as THREE from 'three';
import { InputHandler } from './InputHandler';
import { Renderer } from './Renderer';
import { useGameStore } from '../store/gameStore';

export class GameController {
  constructor(container, network, playerId) {
    this.container = container;
    this.network = network;
    this.playerId = playerId;
    this.renderer = null;
    this.input = null;
    this.players = new Map();
    this.lastTime = 0;
    this.localPlayer = null;
  }

  init() {
    this.renderer = new Renderer(this.container);
    this.renderer.init();
    
    this.input = new InputHandler(this.renderer.camera);
    this.input.init();
    
    this.setupNetworkEvents();
    this.startGameLoop();
  }

  setupNetworkEvents() {
    this.network.on('game_state', (state) => {
      this.updateGameState(state);
    });
    
    this.network.on('hit_marker', ({ shooterId, hitPlayerId }) => {
      if (hitPlayerId === this.playerId) {
        // Показать эффект попадания
        this.renderer.showHitEffect();
      }
    });
  }

  updateGameState(state) {
    const store = useGameStore.getState();
    
    for (const [id, playerData] of Object.entries(state.players)) {
      if (id === this.playerId) {
        store.setHp(playerData.hp);
        store.setKills(playerData.kills);
        
        if (!this.localPlayer) {
          this.localPlayer = playerData;
        }
      } else {
        this.renderer.updatePlayerModel(id, playerData);
      }
    }
  }

  startGameLoop() {
    const gameLoop = (currentTime) => {
      const delta = Math.min(0.033, (currentTime - this.lastTime) / 1000);
      this.lastTime = currentTime;
      
      this.update(delta);
      this.render();
      
      requestAnimationFrame(gameLoop);
    };
    
    requestAnimationFrame(gameLoop);
  }

  update(delta) {
    if (!this.input) return;
    
    const move = this.input.getMovement();
    const rotation = this.input.getRotation();
    
    if (move.x !== 0 || move.z !== 0) {
      this.network.sendMove(move.x, move.z, rotation, delta);
    }
    
    if (this.input.isShooting()) {
      const direction = this.input.getAimDirection();
      this.network.sendShoot(direction);
    }
    
    this.renderer.updateLocalCamera(rotation);
  }

  render() {
    this.renderer.render();
  }

  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.input) {
      this.input.dispose();
    }
  }
}