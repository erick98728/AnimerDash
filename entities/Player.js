import { COLORS, GAME_DATA } from '../data/gameData.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-placeholder');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setSize(30, 46);
    this.setOffset(9, 2);

    this.facingDirection = 1;
    this.maxHealth = GAME_DATA.player.maxHealth;
    this.health = this.maxHealth;
    this.speed = GAME_DATA.player.speed;
    this.jumpForce = GAME_DATA.player.jumpForce;
    this.dashSpeed = GAME_DATA.player.dashSpeed;
    this.attackDamage = GAME_DATA.player.attackDamage;
    this.projectileDamage = GAME_DATA.player.projectileDamage;
    this.canDash = true;
    this.isDashing = false;
    this.isDefeated = false;
    this.isInvulnerable = false;
  }

  static createTexture(scene) {
    if (scene.textures.exists('player-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.player, 1);
    graphics.fillRoundedRect(9, 2, 30, 46, 8);
    graphics.fillStyle(COLORS.playerAccent, 1);
    graphics.fillCircle(24, 13, 7);
    graphics.fillStyle(COLORS.mist, 1);
    graphics.fillTriangle(8, 40, 24, 54, 40, 40);
    graphics.generateTexture('player-placeholder', 48, 56);
    graphics.destroy();
  }

  update(inputSystem) {
    if (this.isDefeated || this.isDashing) return;

    const direction = inputSystem.getHorizontalDirection();
    this.setVelocityX(direction * this.speed);

    if (direction !== 0) {
      this.facingDirection = direction;
      this.setFlipX(direction < 0);
    }

    if (inputSystem.wantsJump() && this.body.blocked.down) {
      this.setVelocityY(-this.jumpForce);
    }

    if (inputSystem.wantsDash()) {
      this.dash();
    }
  }

  dash() {
    if (!this.canDash) return;

    this.canDash = false;
    this.isDashing = true;
    this.isInvulnerable = true;
    this.setVelocityY(0);
    this.setVelocityX(this.facingDirection * this.dashSpeed);
    this.setTint(COLORS.playerAccent);

    this.scene.time.delayedCall(170, () => {
      this.isDashing = false;
      this.isInvulnerable = false;
      this.clearTint();
    });

    this.scene.time.delayedCall(650, () => {
      this.canDash = true;
    });
  }

  takeDamage(amount) {
    if (this.isInvulnerable || this.isDefeated) return;

    this.health = Math.max(0, this.health - amount);
    this.isInvulnerable = true;
    this.setTint(0xff6b6b);

    this.scene.time.delayedCall(450, () => {
      this.isInvulnerable = false;
      this.clearTint();
    });

    if (this.health <= 0) {
      this.isDefeated = true;
      this.setVelocity(0, 0);
    }
  }
}
