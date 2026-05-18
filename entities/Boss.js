import Enemy from './Enemy.js';
import { COLORS, GAME_DATA } from '../data/gameData.js';

export default class Boss extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, {
      health: GAME_DATA.level.bossHealth,
      damage: 18,
      speed: 95,
      patrolDistance: 180,
    });

    this.setTexture('boss-placeholder');
    this.setSize(46, 62);
    this.setOffset(7, 4);
    this.attackCooldown = false;
  }

  static createTexture(scene) {
    if (scene.textures.exists('boss-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.boss, 1);
    graphics.fillRoundedRect(7, 4, 46, 62, 10);
    graphics.fillStyle(0x200814, 1);
    graphics.fillRect(15, 22, 30, 7);
    graphics.fillStyle(COLORS.projectile, 1);
    graphics.fillTriangle(30, 0, 42, 16, 18, 16);
    graphics.generateTexture('boss-placeholder', 60, 72);
    graphics.destroy();
  }

  update(player) {
    if (this.isDefeated) return;

    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

    if (distance < 260) {
      this.direction = player.x < this.x ? -1 : 1;
      this.setVelocityX(this.direction * this.speed);
      this.setFlipX(this.direction > 0);
    } else {
      super.update();
    }
  }
}
