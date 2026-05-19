import Enemy from './Enemy.js';
import EnemyProjectile from './EnemyProjectile.js';
import { COLORS, GAME_DATA } from '../data/gameData.js';

export default class Boss extends Enemy {
  constructor(scene, x, y) {
    const config = GAME_DATA.boss;

    super(scene, x, y, 'heavyGuardian', {
      label: config.name,
      texture: config.texture,
      health: config.health,
      damage: config.attacks.melee.damage,
      speed: config.speed,
      visionRange: 9999,
      attackRange: config.attacks.melee.range,
      attackCooldown: 900,
      dropCoins: config.rewards.coins,
      dropXp: config.rewards.xp,
      bodyWidth: 46,
      bodyHeight: 62,
      bodyOffsetX: 7,
      bodyOffsetY: 4,
    });

    this.bossName = config.name;
    this.bossConfig = config;
    this.phase = 1;
    this.patternIndex = 0;
    this.nextActionAt = 0;
    this.isActing = false;
    this.hasRewarded = false;
    this.setTexture(config.texture);
    this.setSize(46, 62);
    this.setOffset(7, 4);
  }

  static createTexture(scene) {
    if (scene.textures.exists('boss-kaizen-placeholder')) return;

    const graphics = scene.add.graphics();
    graphics.fillStyle(COLORS.boss, 1);
    graphics.fillRoundedRect(7, 4, 46, 62, 10);
    graphics.fillStyle(0x200814, 1);
    graphics.fillRect(15, 22, 30, 7);
    graphics.fillStyle(COLORS.bossMist, 0.9);
    graphics.fillCircle(30, 10, 11);
    graphics.fillStyle(COLORS.projectile, 1);
    graphics.fillTriangle(30, 0, 44, 18, 16, 18);
    graphics.lineStyle(3, 0xffffff, 0.7);
    graphics.strokeRoundedRect(11, 8, 38, 54, 10);
    graphics.generateTexture('boss-kaizen-placeholder', 60, 72);
    graphics.destroy();

    Boss.createPlaceholderAnimations(scene);
  }

  static createPlaceholderAnimations(scene) {
    const textureKey = GAME_DATA.boss.texture;
    const animations = [
      ['boss-kaizen-idle', textureKey, 4],
      ['boss-kaizen-run', textureKey, 7],
      ['boss-kaizen-attack', textureKey, 10],
    ];

    animations.forEach(([key, frameKey, frameRate]) => {
      if (scene.anims.exists(key)) return;
      scene.anims.create({ key, frames: [{ key: frameKey }], frameRate, repeat: -1 });
    });
  }

  update(player, context = {}) {
    if (this.isDefeated || this.isKnockedBack) return;
    if (!player || player.isDefeated) return;

    this.updatePhase();
    this.facePlayer(player);
    this.stayInsideArena();

    if (this.isActing) return;

    const now = this.scene.time.now;
    if (now < this.nextActionAt) {
      this.moveTowardCenterOrPlayer(player);
      return;
    }

    const phaseConfig = this.getPhaseConfig();
    const action = phaseConfig.pattern[this.patternIndex % phaseConfig.pattern.length];
    this.patternIndex += 1;
    this.nextActionAt = now + phaseConfig.actionDelay;
    this.runPatternAction(action, player, context);
  }

  updatePhase() {
    const healthRatio = this.health / this.maxHealth;
    const newPhase = healthRatio <= 0.33 ? 3 : healthRatio <= 0.66 ? 2 : 1;

    if (newPhase !== this.phase) {
      this.phase = newPhase;
      this.patternIndex = 0;
      this.createPhaseShiftEffect();
    }
  }

  getPhaseConfig() {
    return this.bossConfig.phases.find((phase) => phase.id === this.phase) ?? this.bossConfig.phases[0];
  }

  facePlayer(player) {
    this.direction = player.x < this.x ? -1 : 1;
    this.setFlipX(this.direction > 0);
  }

  stayInsideArena() {
    const { left, right } = this.bossConfig.arena;
    this.x = Phaser.Math.Clamp(this.x, left + 30, right - 30);
  }

  moveTowardCenterOrPlayer(player) {
    const distance = Math.abs(player.x - this.x);

    if (distance > 105) {
      this.setVelocityX(this.direction * this.speed * 0.75);
      this.play('boss-kaizen-run', true);
    } else {
      this.setVelocityX(0);
      this.play('boss-kaizen-idle', true);
    }
  }

  runPatternAction(action, player, context) {
    if (action === 'melee') this.performMeleeAttack(player);
    if (action === 'ranged') this.performRangedAttack(player, context.enemyProjectiles);
    if (action === 'area') this.performAreaAttack(player);
    if (action === 'summon') this.performSummon(context.spawnBossMinion);
  }

  performMeleeAttack(player) {
    const attack = this.bossConfig.attacks.melee;
    this.startAction(attack.warningTime + 190);
    this.setVelocityX(0);
    this.play('boss-kaizen-attack', true);

    const warningX = this.x + this.direction * attack.range;
    const warning = this.scene.add.rectangle(warningX, this.y, attack.width, attack.height, COLORS.bossMist, 0.25)
      .setStrokeStyle(2, COLORS.special, 0.85);

    this.scene.tweens.add({ targets: warning, alpha: 0.75, yoyo: true, repeat: 2, duration: 80 });

    this.scene.time.delayedCall(attack.warningTime, () => {
      if (!this.active || this.isDefeated) return;

      warning.destroy();
      const hitbox = this.scene.add.rectangle(warningX, this.y, attack.width, attack.height, 0xffffff, 0.08);
      this.scene.physics.add.existing(hitbox);
      hitbox.body.allowGravity = false;

      this.scene.physics.add.overlap(hitbox, player, () => {
        player.takeDamage(attack.damage);
      });

      this.createBossSlashEffect(warningX, this.y);
      this.scene.time.delayedCall(120, () => hitbox.destroy());
    });
  }

  performRangedAttack(player, enemyProjectiles) {
    const attack = this.bossConfig.attacks.ranged;
    const phaseConfig = this.getPhaseConfig();
    this.startAction(attack.warningTime + 240);
    this.setVelocityX(0);
    this.play('boss-kaizen-attack', true);

    this.createCastWarning(this.x, this.y - 16, attack.warningTime);

    this.scene.time.delayedCall(attack.warningTime, () => {
      if (!this.active || this.isDefeated || !enemyProjectiles) return;

      const count = phaseConfig.mistBladeCount;
      const offsets = count === 1 ? [0] : count === 2 ? [-22, 22] : [-34, 0, 34];

      offsets.forEach((offsetY) => {
        const projectile = new EnemyProjectile(
          this.scene,
          this.x + this.direction * 34,
          this.y - 6 + offsetY,
          this.direction,
          {
            textureKey: 'boss-mist-blade-placeholder',
            damage: attack.damage,
            speed: attack.speed,
            lifeTime: 1900,
          },
        );

        enemyProjectiles.add(projectile);
      });
    });
  }

  performAreaAttack(player) {
    const attack = this.bossConfig.attacks.area;
    this.startAction(attack.warningTime + 220);
    this.setVelocityX(0);
    this.play('boss-kaizen-attack', true);

    const targetX = Phaser.Math.Clamp(player.x, this.bossConfig.arena.left + 50, this.bossConfig.arena.right - 50);
    const targetY = player.y;
    const warning = this.scene.add.circle(targetX, targetY, attack.radius, COLORS.bossMist, 0.25)
      .setStrokeStyle(3, COLORS.special, 0.9);

    this.scene.tweens.add({ targets: warning, alpha: 0.75, scale: 1.12, yoyo: true, repeat: 4, duration: 90 });

    this.scene.time.delayedCall(attack.warningTime, () => {
      if (!this.active || this.isDefeated) return;

      const distance = Phaser.Math.Distance.Between(targetX, targetY, player.x, player.y);
      if (distance <= attack.radius + 18) {
        player.takeDamage(attack.damage);
      }

      this.scene.cameras.main.shake(140, 0.004);
      warning.destroy();
      this.createAreaBurst(targetX, targetY, attack.radius);
    });
  }

  performSummon(spawnBossMinion) {
    const phaseConfig = this.getPhaseConfig();
    this.startAction(520);
    this.setVelocityX(0);
    this.play('boss-kaizen-attack', true);
    this.createCastWarning(this.x, this.y - 26, 420);

    this.scene.time.delayedCall(420, () => {
      if (typeof spawnBossMinion !== 'function') return;

      for (let i = 0; i < phaseConfig.summonCount; i += 1) {
        const side = i % 2 === 0 ? -1 : 1;
        spawnBossMinion(this.x + side * (90 + i * 35), this.y - 10);
      }
    });
  }

  startAction(duration) {
    this.isActing = true;
    this.scene.time.delayedCall(duration, () => {
      if (!this.isDefeated) {
        this.isActing = false;
      }
    });
  }

  createCastWarning(x, y, duration) {
    const warning = this.scene.add.circle(x, y, 22, COLORS.bossMist, 0.4)
      .setStrokeStyle(2, COLORS.special, 0.85);
    warning.setBlendMode(Phaser.BlendModes.ADD);

    this.scene.tweens.add({
      targets: warning,
      alpha: 0,
      scale: 2.2,
      duration,
      onComplete: () => warning.destroy(),
    });
  }

  createBossSlashEffect(x, y) {
    const slash = this.scene.add.arc(x, y, 54, 305, 55, false, COLORS.bossMist, 0.85);
    slash.setScale(this.direction, 0.75);
    slash.setBlendMode(Phaser.BlendModes.ADD);

    this.scene.tweens.add({
      targets: slash,
      alpha: 0,
      scaleX: this.direction * 1.5,
      scaleY: 1.2,
      duration: 180,
      onComplete: () => slash.destroy(),
    });
  }

  createAreaBurst(x, y, radius) {
    const burst = this.scene.add.circle(x, y, radius, COLORS.bossMist, 0.5);
    burst.setBlendMode(Phaser.BlendModes.ADD);

    this.scene.tweens.add({
      targets: burst,
      alpha: 0,
      scale: 1.8,
      duration: 260,
      onComplete: () => burst.destroy(),
    });
  }

  createPhaseShiftEffect() {
    const effect = this.scene.add.circle(this.x, this.y, 56, COLORS.bossMist, 0.45);
    effect.setBlendMode(Phaser.BlendModes.ADD);
    this.scene.cameras.main.shake(160, 0.003);

    this.scene.tweens.add({
      targets: effect,
      alpha: 0,
      scale: 2.4,
      duration: 420,
      onComplete: () => effect.destroy(),
    });
  }

  defeat() {
    if (this.isDefeated) return;

    this.isDefeated = true;
    this.emit('boss-defeated', this);
    this.emit('enemy-defeated', this);
    this.disableBody(true, true);
  }
}
