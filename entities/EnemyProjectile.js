import { COLORS } from '../data/gameData.js';

export default class EnemyProjectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, direction = 1, options = {}) {
    const textureKey = options.textureKey ?? 'enemy-kunai-placeholder';
    super(scene, x, y, textureKey);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.direction = direction;
    this.damage = options.damage ?? 10;
    this.speed = options.speed ?? 360;
    this.body.allowGravity = false;
    this.setVelocityX(this.direction * this.speed);
    this.setVelocityY(options.velocityY ?? 0);
    this.setFlipX(this.direction < 0);

    if (options.scale) {
      this.setScale(options.scale);
    }

    scene.time.delayedCall(options.lifeTime ?? 1600, () => {
      if (this.active) this.destroy();
    });
  }

  static createTexture(scene) {
    EnemyProjectile.createKunaiTexture(scene);
    EnemyProjectile.createMistBladeTexture(scene);
  }

  static createKunaiTexture(scene) {
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

  static createMistBladeTexture(scene) {
    if (scene.textures.exists('boss-mist-blade-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.mist, 0.95);
    graphics.fillRoundedRect(0, 8, 52, 14, 7);
    graphics.fillStyle(0xffffff, 0.85);
    graphics.fillCircle(46, 15, 5);
    graphics.lineStyle(2, COLORS.special, 0.9);
    graphics.strokeRoundedRect(4, 10, 40, 10, 5);
    graphics.generateTexture('boss-mist-blade-placeholder', 56, 30);
    graphics.destroy();
  }
}
