import { COLORS } from '../data/gameData.js';

export default class Collectible extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, value = 1, type = 'coin') {
    const textureKey = type === 'xp' ? 'xp-placeholder' : 'collectible-placeholder';
    super(scene, x, y, textureKey);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.value = value;
    this.type = type;
    this.body.allowGravity = false;
    this.floatOffset = Math.random() * Math.PI * 2;
  }

  static createTexture(scene) {
    Collectible.createCoinTexture(scene);
    Collectible.createXpTexture(scene);
  }

  static createCoinTexture(scene) {
    if (scene.textures.exists('collectible-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.collectible, 1);
    graphics.fillCircle(12, 12, 10);
    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillCircle(9, 8, 3);
    graphics.generateTexture('collectible-placeholder', 24, 24);
    graphics.destroy();
  }

  static createXpTexture(scene) {
    if (scene.textures.exists('xp-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.xp, 1);
    graphics.fillDiamond?.(12, 12, 10, 14);

    // Fallback, pois algumas versões do Phaser podem não ter fillDiamond.
    if (!graphics.fillDiamond) {
      graphics.fillTriangle(12, 0, 24, 12, 12, 24);
      graphics.fillTriangle(12, 0, 0, 12, 12, 24);
    }

    graphics.fillStyle(0xffffff, 0.7);
    graphics.fillCircle(12, 8, 2);
    graphics.generateTexture('xp-placeholder', 24, 24);
    graphics.destroy();
  }

  update(time) {
    this.y += Math.sin(time / 180 + this.floatOffset) * 0.25;
  }
}
