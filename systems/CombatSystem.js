import Projectile from '../entities/Projectile.js';
import { GAME_DATA, COLORS } from '../data/gameData.js';

export default class CombatSystem {
  constructor(scene) {
    this.scene = scene;
  }

  createComboHitbox(attacker, comboStep) {
    const direction = attacker.facingDirection ?? 1;
    const x = attacker.x + direction * comboStep.range;
    const y = attacker.y - 2;

    // Hitbox separada do corpo do jogador. Ela existe por poucos milissegundos.
    const hitbox = this.scene.add.rectangle(
      x,
      y,
      comboStep.width,
      comboStep.height,
      0xffffff,
      0.05,
    );

    this.scene.physics.add.existing(hitbox);
    hitbox.body.allowGravity = false;
    hitbox.damage = comboStep.damage;
    hitbox.knockback = comboStep.knockback;
    hitbox.owner = attacker;
    hitbox.alreadyHit = new Set();

    this.createSlashEffect(x, y, direction, comboStep);

    this.scene.time.delayedCall(comboStep.duration, () => {
      if (hitbox.active) hitbox.destroy();
    });

    return hitbox;
  }

  // Mantém compatibilidade com chamadas antigas do projeto.
  createMeleeHitbox(attacker, damage = 10, range = 42) {
    return this.createComboHitbox(attacker, {
      damage,
      range,
      width: range,
      height: 34,
      duration: 110,
      knockback: 140,
    });
  }

  createShuriken(owner, group) {
    const config = GAME_DATA.player.combat.shuriken;
    const direction = owner.facingDirection ?? 1;

    const projectile = new Projectile(
      this.scene,
      owner.x + direction * 34,
      owner.y - 6,
      direction,
      {
        type: 'shuriken',
        damage: config.damage,
        speed: config.speed,
        knockback: config.knockback,
        lifeTime: 1350,
      },
    );

    group.add(projectile);
    this.createThrowEffect(owner.x + direction * 22, owner.y - 4, direction, COLORS.projectile);
    return projectile;
  }

  createWindOrb(owner, group) {
    const config = GAME_DATA.player.combat.special;
    const direction = owner.facingDirection ?? 1;

    const projectile = new Projectile(
      this.scene,
      owner.x + direction * 40,
      owner.y - 10,
      direction,
      {
        type: 'special',
        damage: config.damage,
        speed: config.speed,
        knockback: config.knockback,
        pierce: true,
        lifeTime: 1750,
      },
    );

    group.add(projectile);
    this.createWindOrbCastEffect(owner.x + direction * 34, owner.y - 10, direction);
    return projectile;
  }

  // Mantém compatibilidade com chamadas antigas do projeto.
  createProjectile(owner, group, damage = 15) {
    const direction = owner.facingDirection ?? 1;
    const projectile = new Projectile(this.scene, owner.x + direction * 32, owner.y - 4, direction, {
      type: 'shuriken',
      damage,
      speed: 430,
      knockback: 110,
    });

    group.add(projectile);
    return projectile;
  }

  applyDamage(target, damage, source) {
    if (!target || target.isDefeated) return;

    const attacker = source?.owner ?? this.scene.player;
    const direction = target.x < attacker.x ? -1 : 1;
    const knockback = source?.knockback ?? 140;
    const knockbackX = direction * knockback;

    target.takeDamage(damage, knockbackX, -80);
    this.createHitSpark(target.x, target.y - 10);
  }

  createSlashEffect(x, y, direction, comboStep) {
    const effect = this.scene.add.arc(x, y, comboStep.width * 0.45, 310, 50, false, COLORS.playerAccent, 0.8);
    effect.setScale(direction, 0.72);
    effect.setBlendMode(Phaser.BlendModes.ADD);

    this.scene.tweens.add({
      targets: effect,
      alpha: 0,
      scaleX: direction * 1.35,
      scaleY: 1.1,
      duration: comboStep.duration,
      onComplete: () => effect.destroy(),
    });
  }

  createThrowEffect(x, y, direction, color) {
    const effect = this.scene.add.circle(x, y, 8, color, 0.85);
    effect.setBlendMode(Phaser.BlendModes.ADD);

    this.scene.tweens.add({
      targets: effect,
      x: x + direction * 22,
      alpha: 0,
      scale: 1.8,
      duration: 170,
      onComplete: () => effect.destroy(),
    });
  }

  createWindOrbCastEffect(x, y, direction) {
    const effect = this.scene.add.circle(x, y, 26, COLORS.special, 0.35);
    effect.setBlendMode(Phaser.BlendModes.ADD);

    this.scene.tweens.add({
      targets: effect,
      x: x + direction * 18,
      alpha: 0,
      scale: 2.2,
      duration: 260,
      onComplete: () => effect.destroy(),
    });
  }

  createHitSpark(x, y) {
    const spark = this.scene.add.star(x, y, 6, 4, 14, COLORS.projectile, 0.9);
    spark.setBlendMode(Phaser.BlendModes.ADD);

    this.scene.tweens.add({
      targets: spark,
      alpha: 0,
      scale: 1.7,
      angle: 90,
      duration: 160,
      onComplete: () => spark.destroy(),
    });
  }
}
