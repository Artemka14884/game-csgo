export class Player {
  constructor(id, name, isHost = false) {
    this.id = id;
    this.name = name;
    this.isHost = isHost;
    this.x = Math.random() * 40 - 20;
    this.z = Math.random() * 40 - 20;
    this.rotation = 0;
    this.hp = 100;
    this.kills = 0;
    this.deaths = 0;
    this.speed = 5.0;
    this.lastShot = 0;
    this.ammo = 30;
  }

  respawn() {
    this.hp = 100;
    this.x = Math.random() * 40 - 20;
    this.z = Math.random() * 40 - 20;
    this.ammo = 30;
  }
}