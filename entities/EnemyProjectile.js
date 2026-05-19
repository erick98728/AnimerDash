import { COLORS } from '../data/gameData.js';

export default class EnemyProjectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, direction = 1, options = {}) {
    super(scene, x, y, 'enemy-kunai-placeholder');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.direction = direction;
    this.damage = options.damage ?? 10;
    this.speed = options.speed ?? 360;
    this.body.allowGravity = false;
    this.setVelocityX(this.direction * this.speed);
    this.setFlipX(this.direction < 0);

    scene.time.delayedCall(options.lifeTime ?? 1600, () => {
      if (this.active) this.destroy();
    });
  }

  static createTexture(scene) {
    if (scene.textures.exists('enemy-kunai-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(0xd7dce8, 1);
    graphics.fillTriangle(0, 8, 20, 0, 20, 16);
    graphics.fillStyle(COLORS.enemy, 1);
    graphics.fillRect(18, 5, 12, 6);
    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillCircle(31, 8, 3);
    graphics.generateTexture('enemy-kunai-placeholder', 36, 18);
    graphics.destroy();
  }
}
