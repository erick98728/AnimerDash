import { ASSET_MANIFEST, getTextureKey } from '../data/assetsManifest.js';
import { COLORS, GAME_DATA } from '../data/gameData.js';
import { AUDIO_KEYS } from '../systems/AudioSystem.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    const idleTexture = getTextureKey(scene, ASSET_MANIFEST.player.ren.idle, 'player-idle-placeholder');
    super(scene, x, y, idleTexture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setSize(30, 46);
    this.setOffset(9, 2);

    this.facingDirection = 1;
    this.maxHealth = GAME_DATA.player.maxHealth;
    this.health = this.maxHealth;

    this.maxEnergy = GAME_DATA.player.maxEnergy;
    this.energy = this.maxEnergy;
    this.energyRegenPerSecond = GAME_DATA.player.energyRegenPerSecond;

    this.speed = GAME_DATA.player.speed;
    this.acceleration = GAME_DATA.player.acceleration;
    this.deceleration = GAME_DATA.player.deceleration;
    this.jumpForce = GAME_DATA.player.jumpForce;
    this.doubleJumpForce = GAME_DATA.player.doubleJumpForce;
    this.maxJumps = GAME_DATA.player.maxJumps;
    this.jumpCount = 0;

    this.dashSpeed = GAME_DATA.player.dashSpeed;
    this.dashDuration = GAME_DATA.player.dashDuration;
    this.dashCooldown = GAME_DATA.player.dashCooldown;
    this.canDash = true;
    this.isDashing = false;

    this.comboIndex = 0;
    this.lastComboAt = 0;
    this.canAttack = true;
    this.canThrowShuriken = true;
    this.canUseSpecial = true;

    this.attackDamage = GAME_DATA.player.attackDamage;
    this.projectileDamage = GAME_DATA.player.projectileDamage;
    this.isDefeated = false;
    this.isInvulnerable = false;
  }

  static createTexture(scene) {
    Player.createPlaceholderTextures(scene);
    Player.createPlaceholderAnimations(scene);
  }

  static createPlaceholderTextures(scene) {
    const frames = [
      { key: 'player-idle-placeholder', bodyColor: COLORS.player, accentColor: COLORS.playerAccent, capeColor: COLORS.mist, bodyX: 9, bodyY: 3, bodyW: 30, bodyH: 45 },
      { key: 'player-run-placeholder', bodyColor: COLORS.player, accentColor: 0xdffaff, capeColor: COLORS.mist, bodyX: 7, bodyY: 3, bodyW: 34, bodyH: 43 },
      { key: 'player-jump-placeholder', bodyColor: 0x8ff0ff, accentColor: COLORS.playerAccent, capeColor: 0x7053ff, bodyX: 10, bodyY: 1, bodyW: 28, bodyH: 44 },
      { key: 'player-fall-placeholder', bodyColor: 0x63d8ee, accentColor: COLORS.playerAccent, capeColor: 0x4c35c4, bodyX: 9, bodyY: 6, bodyW: 30, bodyH: 44 },
      { key: 'player-dash-placeholder', bodyColor: COLORS.playerAccent, accentColor: COLORS.player, capeColor: 0x9d7cff, bodyX: 4, bodyY: 12, bodyW: 42, bodyH: 24 },
    ];

    frames.forEach((frame) => {
      if (scene.textures.exists(frame.key)) return;

      const graphics = scene.add.graphics();
      graphics.fillStyle(frame.bodyColor, 1);
      graphics.fillRoundedRect(frame.bodyX, frame.bodyY, frame.bodyW, frame.bodyH, 8);
      graphics.fillStyle(frame.accentColor, 1);
      graphics.fillCircle(24, 13, 7);
      graphics.fillStyle(frame.capeColor, 1);
      graphics.fillTriangle(8, 40, 24, 54, 40, 40);
      graphics.generateTexture(frame.key, 48, 56);
      graphics.destroy();
    });

    if (!scene.textures.exists('player-placeholder')) {
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
  }

  static createPlaceholderAnimations(scene) {
    const animations = [
      ['player-idle', getTextureKey(scene, ASSET_MANIFEST.player.ren.idle, 'player-idle-placeholder'), 6],
      ['player-run', getTextureKey(scene, ASSET_MANIFEST.player.ren.run, 'player-run-placeholder'), 12],
      ['player-jump', getTextureKey(scene, ASSET_MANIFEST.player.ren.jump, 'player-jump-placeholder'), 1],
      ['player-fall', getTextureKey(scene, ASSET_MANIFEST.player.ren.fall, 'player-fall-placeholder'), 1],
      ['player-dash', getTextureKey(scene, ASSET_MANIFEST.player.ren.dash, 'player-dash-placeholder'), 1],
    ];

    animations.forEach(([key, textureKey, frameRate]) => {
      if (scene.anims.exists(key)) return;

      const texture = scene.textures.get(textureKey);
      const frameEnd = Math.max(0, (texture?.frameTotal ?? 1) - 2);
      const frames = frameEnd > 0
        ? scene.anims.generateFrameNumbers(textureKey, { start: 0, end: frameEnd })
        : [{ key: textureKey }];

      scene.anims.create({ key, frames, frameRate, repeat: -1 });
    });
  }

  static createRealAssetAnimations(scene) {
    Player.createPlaceholderAnimations(scene);
  }

  update(inputSystem, delta = 16.67) {
    if (this.isDefeated) return;

    const deltaSeconds = delta / 1000;
    const isOnGround = this.body.blocked.down;

    this.energy = Math.min(this.maxEnergy, this.energy + this.energyRegenPerSecond * deltaSeconds);

    if (isOnGround) this.jumpCount = 0;

    if (!this.isDashing) {
      this.handleHorizontalMovement(inputSystem, deltaSeconds);
      this.handleJump(inputSystem);
    }

    if (inputSystem.wantsDash()) this.dash();

    this.updateAnimationState();
  }

  handleHorizontalMovement(inputSystem, deltaSeconds) {
    const direction = inputSystem.getHorizontalDirection();

    if (direction !== 0) {
      this.facingDirection = direction;
      this.setFlipX(direction < 0);

      const nextVelocity = Phaser.Math.Clamp(
        this.body.velocity.x + direction * this.acceleration * deltaSeconds,
        -this.speed,
        this.speed,
      );

      this.setVelocityX(nextVelocity);
      return;
    }

    const currentVelocity = this.body.velocity.x;
    const slowDown = this.deceleration * deltaSeconds;

    if (Math.abs(currentVelocity) <= slowDown) {
      this.setVelocityX(0);
    } else {
      this.setVelocityX(currentVelocity - Math.sign(currentVelocity) * slowDown);
    }
  }

  handleJump(inputSystem) {
    if (!inputSystem.wantsJump()) return;
    if (this.jumpCount >= this.maxJumps) return;

    const force = this.jumpCount === 0 ? this.jumpForce : this.doubleJumpForce;
    this.setVelocityY(-force);
    this.jumpCount += 1;
    this.scene.audioSystem?.playSfx(AUDIO_KEYS.sfx.jump);
  }

  getNextComboStep() {
    const combat = GAME_DATA.player.combat;
    const now = this.scene.time.now;

    if (now - this.lastComboAt > combat.comboResetTime) this.comboIndex = 0;

    const comboStep = combat.comboSteps[this.comboIndex];
    this.comboIndex = (this.comboIndex + 1) % combat.comboSteps.length;
    this.lastComboAt = now;

    return comboStep;
  }

  spendEnergy(amount) {
    if (this.energy < amount) return false;
    this.energy -= amount;
    return true;
  }

  gainEnergy(amount) {
    this.energy = Math.min(this.maxEnergy, this.energy + amount);
  }

  dash() {
    if (!this.canDash || this.isDashing) return;

    this.canDash = false;
    this.isDashing = true;
    this.isInvulnerable = true;
    this.scene.audioSystem?.playSfx(AUDIO_KEYS.sfx.dash);

    this.body.allowGravity = false;
    this.setVelocityY(0);
    this.setVelocityX(this.facingDirection * this.dashSpeed);
    this.play('player-dash', true);
    this.setTint(COLORS.playerAccent);

    this.scene.time.delayedCall(this.dashDuration, () => {
      this.isDashing = false;
      this.isInvulnerable = false;
      this.body.allowGravity = true;
      this.clearTint();
    });

    this.scene.time.delayedCall(this.dashCooldown, () => {
      this.canDash = true;
    });
  }

  updateAnimationState() {
    if (this.isDashing) return this.play('player-dash', true);
    if (this.body.velocity.y < -30) return this.play('player-jump', true);
    if (this.body.velocity.y > 30) return this.play('player-fall', true);
    if (Math.abs(this.body.velocity.x) > 18) return this.play('player-run', true);
    return this.play('player-idle', true);
  }

  takeDamage(amount) {
    if (this.isInvulnerable || this.isDefeated) return;

    this.health = Math.max(0, this.health - amount);
    this.isInvulnerable = true;
    this.setTint(0xff6b6b);
    this.scene.audioSystem?.playSfx(AUDIO_KEYS.sfx.damage);

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
