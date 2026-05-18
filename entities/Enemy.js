import { COLORS } from '../data/gameData.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, options = {}) {
    super(scene, x, y, 'enemy-placeholder');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0.05);
    this.setSize(30, 38);
    this.setOffset(5, 4);

    this.maxHealth = options.health ?? 45;
    this.health = this.maxHealth;
    this.damage = options.damage ?? 12;
    this.speed = options.speed ?? 80;
    this.patrolDistance = options.patrolDistance ?? 120;
    this.startX = x;
    this.direction = options.direction ?? -1;
    this.isDefeated = false;
    this.isInvulnerable = false;
  }

  static createTexture(scene) {
    if (scene.textures.exists('enemy-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.enemy, 1);
    graphics.fillRoundedRect(5, 4, 30, 38, 7);
    graphics.fillStyle(0x1a102b, 1);
    graphics.fillRect(10, 15, 20, 5);
    graphics.generateTexture('enemy-placeholder', 40, 46);
    graphics.destroy();
  }

  update() {
    if (this.isDefeated) return;

    if (Math.abs(this.x - this.startX) > this.patrolDistance) {
      this.direction *= -1;
    }

    this.setVelocityX(this.direction * this.speed);
    this.setFlipX(this.direction > 0);
  }

  takeDamage(amount) {
    if (this.isDefeated) return;

    this.health = Math.max(0, this.health - amount);
    this.setTint(0xffffff);

    this.scene.time.delayedCall(120, () => {
      if (!this.isDefeated) this.clearTint();
    });

    if (this.health <= 0) {
      this.defeat();
    }
  }

  defeat() {
    this.isDefeated = true;
    this.disableBody(true, true);
  }
}
