import Projectile from '../entities/Projectile.js';

export default class CombatSystem {
  constructor(scene) {
    this.scene = scene;
  }

  createMeleeHitbox(attacker, damage = 10, range = 42) {
    const direction = attacker.facingDirection ?? 1;
    const x = attacker.x + direction * range;
    const y = attacker.y;

    const hitbox = this.scene.add.rectangle(x, y, range, 34, 0xffffff, 0.1);
    this.scene.physics.add.existing(hitbox);
    hitbox.body.allowGravity = false;
    hitbox.damage = damage;
    hitbox.owner = attacker;

    this.scene.time.delayedCall(110, () => {
      hitbox.destroy();
    });

    return hitbox;
  }

  createProjectile(owner, group, damage = 15) {
    const direction = owner.facingDirection ?? 1;
    const projectile = new Projectile(
      this.scene,
      owner.x + direction * 32,
      owner.y - 4,
      direction,
      damage,
    );

    group.add(projectile);
    return projectile;
  }

  applyDamage(target, damage) {
    if (!target || target.isDefeated || target.isInvulnerable) return;

    target.takeDamage(damage);

    if (target.body) {
      const knockback = target.x < this.scene.player.x ? -140 : 140;
      target.setVelocityX(knockback);
    }
  }
}
