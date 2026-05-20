import { Player } from './Player.js';
import { WeaponSystem } from './WeaponSystem.js';
import { checkCollision } from './Collision.js';

export class GameState {
  constructor(roomId) {
    this.roomId = roomId;
    this.players = new Map();
    this.gameActive = false;
    this.weaponSystem = new WeaponSystem();
    this.mapBounds = {
      minX: -30,
      maxX: 30,
      minZ: -30,
      maxZ: 30
    };
  }

  addPlayer(id, name) {
    const isHost = this.players.size === 0;
    const player = new Player(id, name, isHost);
    this.players.set(id, player);
    return player;
  }

  removePlayer(id) {
    this.players.delete(id);
  }

  startGame() {
    this.gameActive = true;
    // Респавн всех игроков
    for (const player of this.players.values()) {
      player.respawn();
    }
  }

  updatePlayerPosition(id, data) {
    const player = this.players.get(id);
    if (!player || !this.gameActive) return;

    const newX = player.x + data.moveX * player.speed * data.delta;
    const newZ = player.z + data.moveZ * player.speed * data.delta;
    
    // Проверка коллизий с границами карты
    if (newX >= this.mapBounds.minX && newX <= this.mapBounds.maxX) {
      player.x = newX;
    }
    if (newZ >= this.mapBounds.minZ && newZ <= this.mapBounds.maxZ) {
      player.z = newZ;
    }
    
    player.rotation = data.rotation;
  }

  processShoot(shooterId, data) {
    const shooter = this.players.get(shooterId);
    if (!shooter || !this.gameActive || shooter.hp <= 0) return null;

    // Проверка перезарядки
    if (!this.weaponSystem.canShoot(shooter)) return null;

    // Raycast для поиска попадания
    let closestHit = null;
    let minDistance = Infinity;

    for (const [id, target] of this.players) {
      if (id === shooterId || target.hp <= 0) continue;
      
      const distance = this.weaponSystem.checkHit(
        shooter, 
        target, 
        data.rayDirection
      );
      
      if (distance && distance < minDistance) {
        minDistance = distance;
        closestHit = target;
      }
    }

    if (closestHit) {
      const damage = this.weaponSystem.calculateDamage(closestHit);
      closestHit.hp -= damage;
      
      if (closestHit.hp <= 0) {
        shooter.kills++;
        this.handleDeath(closestHit, shooter);
      }
      
      return { playerId: closestHit.id, damage };
    }
    
    return null;
  }

  handleDeath(victim, killer) {
    victim.respawn();
    killer.kills++;
    
    // Оповещаем всех о смерти
    // (в реальном коде нужно отправить событие)
  }

  getPlayersList() {
    const playersList = [];
    for (const [id, player] of this.players) {
      playersList.push({
        id,
        name: player.name,
        kills: player.kills,
        deaths: player.deaths,
        hp: player.hp,
        isHost: player.isHost
      });
    }
    return playersList;
  }

  getSerializedState() {
    const players = {};
    for (const [id, player] of this.players) {
      players[id] = {
        id,
        x: player.x,
        z: player.z,
        rotation: player.rotation,
        hp: player.hp,
        kills: player.kills
      };
    }
    return { players, gameActive: this.gameActive };
  }

  update() {
    // Обновление состояния игры (спавн, таймеры и т.д.)
  }
}