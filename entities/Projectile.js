import { COLORS } from '../data/gameData.js';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, direction = 1, damage = 15) {
    super(scene, x, y, 'projectile-placeholder');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.direction = direction;
    this.damage = damage;
    this.body.allowGravity = false;
    this.setVelocityX(direction * 430);
    this.setFlipX(direction < 0);

    scene.time.delayedCall(1300, () => {
      if (this.active) this.destroy();
    });
  }

  static createTexture(scene) {
    if (scene.textures.exists('projectile-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.projectile, 1);
    graphics.fillRoundedRect(0, 5, 28, 8, 4);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(24, 9, 3);
    graphics.generateTexture('projectile-placeholder', 30, 18);
    graphics.destroy();
  }
}
