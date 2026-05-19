import { AUDIO_KEYS } from './AudioSystem.js';

export default class CollisionSystem {
  constructor(scene) {
    this.scene = scene;
  }

  create() {
    const scene = this.scene;

    scene.physics.add.overlap(scene.player, scene.collectibles, (_player, collectible) => {
      if (collectible.type === 'xp') {
        scene.levelXp += collectible.value;
        scene.audioSystem?.playSfx(AUDIO_KEYS.sfx.xp);
      } else {
        scene.levelCoins += collectible.value;
        scene.retentionSystem.recordCoinsCollected(collectible.value);
        scene.audioSystem?.playSfx(AUDIO_KEYS.sfx.coin);
      }

      collectible.destroy();
    });

    scene.physics.add.overlap(scene.player, scene.enemies, (player, enemy) => {
      player.takeDamage(Math.ceil(enemy.damage * 0.45));
    });

    scene.physics.add.overlap(scene.player, scene.bosses, (player, boss) => {
      player.takeDamage(Math.ceil(boss.damage * 0.55));
    });

    scene.physics.add.overlap(scene.player, scene.enemyProjectiles, (player, projectile) => {
      player.takeDamage(projectile.damage);
      projectile.destroy();
    });

    scene.physics.add.overlap(scene.player, scene.obstacles, (player, obstacle) => {
      this.handleObstacleOverlap(player, obstacle);
    });

    if (scene.endPoint) {
      scene.physics.add.overlap(scene.player, scene.endPoint, () => {
        scene.handleEndPointReached();
      });
    }

    scene.physics.add.overlap(scene.meleeHitboxes, scene.enemies, this.handleHitboxOverlap, undefined, this);
    scene.physics.add.overlap(scene.meleeHitboxes, scene.bosses, this.handleHitboxOverlap, undefined, this);
    scene.physics.add.overlap(scene.projectiles, scene.enemies, this.handleProjectileOverlap, undefined, this);
    scene.physics.add.overlap(scene.projectiles, scene.bosses, this.handleProjectileOverlap, undefined, this);
  }

  handleObstacleOverlap(player, obstacle) {
    if (!obstacle.active || this.scene.isLevelFinished) return;

    if (obstacle.type === 'pit') {
      player.takeDamage(player.maxHealth);
      return;
    }

    player.takeDamage(obstacle.damage ?? 10);
  }

  handleHitboxOverlap(hitbox, enemy) {
    if (!hitbox.active || !enemy.active || enemy.isDefeated) return;
    if (hitbox.alreadyHit.has(enemy)) return;

    hitbox.alreadyHit.add(enemy);
    this.scene.combatSystem.applyDamage(enemy, hitbox.damage, hitbox);
    hitbox.owner?.gainEnergy?.(hitbox.energyGain ?? 0);
  }

  handleProjectileOverlap(projectile, enemy) {
    if (!projectile.active || !enemy.active || enemy.isDefeated) return;

    this.scene.combatSystem.applyDamage(enemy, projectile.damage, projectile);

    if (!projectile.pierce) {
      projectile.destroy();
    }
  }
}
