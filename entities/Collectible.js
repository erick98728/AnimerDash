import { COLORS } from '../data/gameData.js';

export default class Collectible extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, value = 1) {
    super(scene, x, y, 'collectible-placeholder');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.value = value;
    this.body.allowGravity = false;
    this.floatOffset = Math.random() * Math.PI * 2;
  }

  static createTexture(scene) {
    if (scene.textures.exists('collectible-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.collectible, 1);
    graphics.fillCircle(12, 12, 10);
    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillCircle(9, 8, 3);
    graphics.generateTexture('collectible-placeholder', 24, 24);
    graphics.destroy();
  }

  update(time) {
    this.y += Math.sin(time / 180 + this.floatOffset) * 0.25;
  }
}
