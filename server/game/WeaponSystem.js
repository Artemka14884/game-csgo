export class WeaponSystem {
  constructor() {
    this.weapons = {
      ak47: {
        damage: 34,
        range: 50,
        fireRate: 100, // ms
        spread: 0.05
      }
    };
  }

  canShoot(player) {
    const now = Date.now();
    if (now - player.lastShot < 100) return false;
    if (player.ammo <= 0) return false;
    
    player.lastShot = now;
    player.ammo--;
    return true;
  }

  checkHit(shooter, target, rayDirection) {
    // Простая проверка попадания
    const dx = target.x - shooter.x;
    const dz = target.z - shooter.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance > 50) return null;
    
    const angleToTarget = Math.atan2(dz, dx);
    const angleDiff = Math.abs(angleToTarget - rayDirection);
    
    if (angleDiff < 0.2) { // ~11.5 градусов
      return distance;
    }
    
    return null;
  }

  calculateDamage(target) {
    return 34; // Простой урон
  }
}