import EnemyProjectile from './EnemyProjectile.js';
import { COLORS, GAME_DATA } from '../data/gameData.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'weakNinja', options = {}) {
    const config = {
      ...GAME_DATA.enemies[type],
      ...options,
    };

    super(scene, x, y, config.texture ?? 'enemy-placeholder');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.enemyType = type;
    this.label = config.label;
    this.config = config;

    this.setCollideWorldBounds(true);
    this.setBounce(0.05);
    this.setSize(config.bodyWidth ?? 30, config.bodyHeight ?? 38);
    this.setOffset(config.bodyOffsetX ?? 5, config.bodyOffsetY ?? 4);

    this.maxHealth = config.health ?? 45;
    this.health = this.maxHealth;
    this.damage = config.damage ?? 12;
    this.speed = config.speed ?? 80;
    this.visionRange = config.visionRange ?? 300;
    this.attackRange = config.attackRange ?? 44;
    this.attackCooldown = config.attackCooldown ?? 800;
    this.preferredDistance = config.preferredDistance ?? 180;
    this.teleportCooldown = config.teleportCooldown ?? 1500;
    this.teleportDistance = config.teleportDistance ?? 140;
    this.patrolDistance = config.patrolDistance ?? 120;
    this.startX = x;
    this.direction = options.direction ?? -1;
    this.dropCoins = config.dropCoins ?? Phaser.Math.Between(1, 3);
    this.dropXp = config.dropXp ?? Phaser.Math.Between(1, 2);

    this.lastAttackAt = -9999;
    this.lastTeleportAt = -9999;
    this.isDefeated = false;
    this.isInvulnerable = false;
    this.isKnockedBack = false;
    this.isAttacking = false;
  }

  static createTexture(scene) {
    Enemy.createLegacyTexture(scene);
    Enemy.createEnemyTexture(scene, 'enemy-weak-ninja-placeholder', COLORS.enemyWeak, 0x1a102b, 'weakNinja');
    Enemy.createEnemyTexture(scene, 'enemy-kunai-shooter-placeholder', COLORS.enemyShooter, 0x3a2510, 'kunaiShooter');
    Enemy.createEnemyTexture(scene, 'enemy-heavy-guardian-placeholder', COLORS.enemyHeavy, 0x1f2733, 'heavyGuardian');
    Enemy.createEnemyTexture(scene, 'enemy-shadow-ninja-placeholder', COLORS.enemyShadow, 0x0d0716, 'shadowNinja');
    Enemy.createPlaceholderAnimations(scene);
  }

  static createLegacyTexture(scene) {
    if (scene.textures.exists('enemy-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.enemy, 1);
    graphics.fillRoundedRect(5, 4, 30, 38, 7);
    graphics.fillStyle(0x1a102b, 1);
    graphics.fillRect(10, 15, 20, 5);
    graphics.generateTexture('enemy-placeholder', 40, 46);
    graphics.destroy();
  }

  static createEnemyTexture(scene, key, bodyColor, maskColor, type) {
    if (scene.textures.exists(key)) return;

    const graphics = scene.add.graphics();
    const isHeavy = type === 'heavyGuardian';
    const isShadow = type === 'shadowNinja';
    const isShooter = type === 'kunaiShooter';

    graphics.fillStyle(bodyColor, 1);
    graphics.fillRoundedRect(isHeavy ? 2 : 5, isHeavy ? 0 : 4, isHeavy ? 40 : 30, isHeavy ? 46 : 38, 7);
    graphics.fillStyle(maskColor, 1);
    graphics.fillRect(isHeavy ? 10 : 10, isHeavy ? 15 : 15, isHeavy ? 24 : 20, 5);

    if (isShooter) {
      graphics.fillStyle(0xd7dce8, 1);
      graphics.fillTriangle(33, 20, 44, 15, 44, 25);
    }

    if (isHeavy) {
      graphics.fillStyle(0xd7dce8, 0.65);
      graphics.fillRect(7, 28, 30, 12);
    }

    if (isShadow) {
      graphics.fillStyle(COLORS.mist, 0.8);
      graphics.fillCircle(20, 8, 5);
      graphics.fillTriangle(4, 38, 20, 52, 36, 38);
    }

    graphics.generateTexture(key, 48, 56);
    graphics.destroy();
  }

  static createPlaceholderAnimations(scene) {
    Object.values(GAME_DATA.enemies).forEach((config) => {
      const baseKey = config.texture;
      const anims = [
        [`${baseKey}-idle`, baseKey, 4],
        [`${baseKey}-run`, baseKey, 8],
        [`${baseKey}-attack`, baseKey, 10],
      ];

      anims.forEach(([key, textureKey, frameRate]) => {
        if (scene.anims.exists(key)) return;

        scene.anims.create({
          key,
          frames: [{ key: textureKey }],
          frameRate,
          repeat: -1,
        });
      });
    });
  }

  update(player, enemyProjectiles) {
    if (this.isDefeated || this.isKnockedBack) return;

    if (!player || player.isDefeated) {
      this.patrol();
      return;
    }

    const distanceX = player.x - this.x;
    const distanceY = Math.abs(player.y - this.y);
    const distanceAbs = Math.abs(distanceX);
    const canSeePlayer = distanceAbs <= this.visionRange && distanceY < 130;

    if (!canSeePlayer) {
      this.patrol();
      return;
    }

    this.direction = distanceX < 0 ? -1 : 1;
    this.setFlipX(this.direction > 0);

    if (this.enemyType === 'kunaiShooter') {
      this.updateKunaiShooter(player, enemyProjectiles, distanceAbs);
      return;
    }

    if (this.enemyType === 'shadowNinja') {
      this.updateShadowNinja(player, distanceAbs);
      return;
    }

    this.updateMeleeChaser(player, distanceAbs);
  }

  patrol() {
    if (Math.abs(this.x - this.startX) > this.patrolDistance) {
      this.direction *= -1;
    }

    this.setVelocityX(this.direction * this.speed * 0.55);
    this.setFlipX(this.direction > 0);
    this.playAnimation('run');
  }

  updateMeleeChaser(player, distanceAbs) {
    if (distanceAbs > this.attackRange) {
      this.setVelocityX(this.direction * this.speed);
      this.playAnimation('run');
      return;
    }

    this.setVelocityX(0);
    this.tryMeleeAttack(player);
  }

  updateKunaiShooter(player, enemyProjectiles, distanceAbs) {
    if (distanceAbs < this.preferredDistance - 35) {
      this.setVelocityX(-this.direction * this.speed);
      this.playAnimation('run');
    } else if (distanceAbs > this.preferredDistance + 45) {
      this.setVelocityX(this.direction * this.speed);
      this.playAnimation('run');
    } else {
      this.setVelocityX(0);
      this.playAnimation('idle');
    }

    if (distanceAbs <= this.attackRange) {
      this.tryShootKunai(enemyProjectiles);
    }
  }

  updateShadowNinja(player, distanceAbs) {
    const now = this.scene.time.now;

    if (distanceAbs > this.attackRange && distanceAbs < this.visionRange && now - this.lastTeleportAt >= this.teleportCooldown) {
      this.teleportNearPlayer(player);
      return;
    }

    if (distanceAbs > this.attackRange) {
      this.setVelocityX(this.direction * this.speed);
      this.playAnimation('run');
      return;
    }

    this.setVelocityX(0);
    this.tryMeleeAttack(player);
  }

  tryMeleeAttack(player) {
    const now = this.scene.time.now;
    if (now - this.lastAttackAt < this.attackCooldown) return;

    this.lastAttackAt = now;
    this.isAttacking = true;
    this.playAnimation('attack');

    this.createAttackEffect();

    this.scene.time.delayedCall(120, () => {
      if (!this.active || this.isDefeated || !player.active) return;

      const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
      if (distance <= this.attackRange + 20) {
        player.takeDamage(this.damage);
      }
    });

    this.scene.time.delayedCall(260, () => {
      this.isAttacking = false;
    });
  }

  tryShootKunai(enemyProjectiles) {
    const now = this.scene.time.now;
    if (now - this.lastAttackAt < this.attackCooldown) return;

    this.lastAttackAt = now;
    this.playAnimation('attack');
    this.createAttackEffect();

    const projectile = new EnemyProjectile(
      this.scene,
      this.x + this.direction * 28,
      this.y - 6,
      this.direction,
      {
        damage: this.config.projectileDamage ?? this.damage,
        speed: this.config.projectileSpeed ?? 360,
      },
    );

    enemyProjectiles.add(projectile);
  }

  teleportNearPlayer(player) {
    this.lastTeleportAt = this.scene.time.now;
    this.createTeleportEffect(this.x, this.y);

    const side = player.x > this.x ? -1 : 1;
    const targetX = Phaser.Math.Clamp(player.x + side * this.teleportDistance, 40, this.scene.physics.world.bounds.width - 40);

    this.setPosition(targetX, this.y - 8);
    this.direction = player.x < this.x ? -1 : 1;
    this.setFlipX(this.direction > 0);
    this.createTeleportEffect(this.x, this.y);
  }

  createAttackEffect() {
    const x = this.x + this.direction * 28;
    const effect = this.scene.add.arc(x, this.y, 24, 300, 60, false, 0xffffff, 0.45);
    effect.setScale(this.direction, 0.65);
    effect.setBlendMode(Phaser.BlendModes.ADD);

    this.scene.tweens.add({
      targets: effect,
      alpha: 0,
      scaleX: this.direction * 1.3,
      scaleY: 1,
      duration: 180,
      onComplete: () => effect.destroy(),
    });
  }

  createTeleportEffect(x, y) {
    const effect = this.scene.add.circle(x, y, 28, COLORS.mist, 0.45);
    effect.setBlendMode(Phaser.BlendModes.ADD);

    this.scene.tweens.add({
      targets: effect,
      alpha: 0,
      scale: 2,
      duration: 260,
      onComplete: () => effect.destroy(),
    });
  }

  playAnimation(state) {
    const animKey = `${this.config.texture}-${state}`;
    if (this.anims?.currentAnim?.key === animKey) return;
    this.play(animKey, true);
  }

  takeDamage(amount, knockbackX = 0, knockbackY = -70) {
    if (this.isDefeated) return;

    this.health = Math.max(0, this.health - amount);
    this.flashOnHit();
    this.applyKnockback(knockbackX, knockbackY);

    if (this.health <= 0) {
      this.defeat();
    }
  }

  flashOnHit() {
    this.setTint(0xffffff);
    this.setAlpha(0.45);

    this.scene.time.delayedCall(70, () => {
      if (!this.isDefeated) {
        this.setAlpha(1);
        this.setTint(0xffd166);
      }
    });

    this.scene.time.delayedCall(140, () => {
      if (!this.isDefeated) {
        this.setAlpha(0.65);
        this.clearTint();
      }
    });

    this.scene.time.delayedCall(210, () => {
      if (!this.isDefeated) {
        this.setAlpha(1);
      }
    });
  }

  applyKnockback(knockbackX, knockbackY) {
    this.isKnockedBack = true;
    this.setVelocity(knockbackX, knockbackY);

    this.scene.time.delayedCall(180, () => {
      if (!this.isDefeated) {
        this.isKnockedBack = false;
      }
    });
  }

  defeat() {
    this.isDefeated = true;
    this.emit('enemy-defeated', this);
    this.disableBody(true, true);
  }
}
