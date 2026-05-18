import { COLORS } from '../data/gameData.js';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, direction = 1, options = {}) {
    const type = options.type ?? 'shuriken';
    const textureKey = type === 'special' ? 'wind-orb-placeholder' : 'shuriken-placeholder';
    super(scene, x, y, textureKey);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.type = type;
    this.direction = direction;
    this.damage = options.damage ?? 15;
    this.knockback = options.knockback ?? 120;
    this.pierce = options.pierce ?? false;
    this.body.allowGravity = false;

    const speed = options.speed ?? 430;
    this.setVelocityX(direction * speed);
    this.setFlipX(direction < 0);

    if (type === 'special') {
      this.setCircle(17);
      this.setScale(1.15);
    }

    scene.time.delayedCall(options.lifeTime ?? 1400, () => {
      if (this.active) this.destroy();
    });
  }

  static createTexture(scene) {
    Projectile.createShurikenTexture(scene);
    Projectile.createWindOrbTexture(scene);

    // Mantém compatibilidade com código antigo.
    if (!scene.textures.exists('projectile-placeholder')) {
      Projectile.createLegacyProjectileTexture(scene);
    }
  }

  static createShurikenTexture(scene) {
    if (scene.textures.exists('shuriken-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.projectile, 1);
    graphics.fillTriangle(14, 0, 19, 10, 9, 10);
    graphics.fillTriangle(28, 14, 18, 19, 18, 9);
    graphics.fillTriangle(14, 28, 9, 18, 19, 18);
    graphics.fillTriangle(0, 14, 10, 9, 10, 19);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(14, 14, 4);
    graphics.generateTexture('shuriken-placeholder', 28, 28);
    graphics.destroy();
  }

  static createWindOrbTexture(scene) {
    if (scene.textures.exists('wind-orb-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.special, 0.85);
    graphics.fillCircle(22, 22, 18);
    graphics.lineStyle(3, 0xffffff, 0.8);
    graphics.strokeCircle(22, 22, 12);
    graphics.lineStyle(2, COLORS.player, 0.9);
    graphics.beginPath();
    graphics.arc(22, 22, 18, Phaser.Math.DegToRad(210), Phaser.Math.DegToRad(350));
    graphics.strokePath();
    graphics.generateTexture('wind-orb-placeholder', 44, 44);
    graphics.destroy();
  }

  static createLegacyProjectileTexture(scene) {
    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.projectile, 1);
    graphics.fillRoundedRect(0, 5, 28, 8, 4);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(24, 9, 3);
    graphics.generateTexture('projectile-placeholder', 30, 18);
    graphics.destroy();
  }
}
