import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Boss from '../entities/Boss.js';
import Collectible from '../entities/Collectible.js';
import CombatSystem from '../systems/CombatSystem.js';
import InputSystem from '../systems/InputSystem.js';
import ProgressionSystem from '../systems/ProgressionSystem.js';
import { GAME_DATA } from '../data/gameData.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.add.image(480, 270, 'mist-bg-placeholder');
    this.physics.world.setBounds(0, 0, 1700, 540);

    this.combatSystem = new CombatSystem(this);
    this.inputSystem = new InputSystem(this);
    this.progressionSystem = new ProgressionSystem();
    this.levelCoins = 0;
    this.levelXp = 0;
    this.isLevelFinished = false;
    this.bossRewardApplied = false;

    this.createLevel();
    this.createPlayer();
    this.createEnemies();
    this.createCollectibles();
    this.createHud();
    this.createBossHud();
    this.createCollisions();

    this.cameras.main.setBounds(0, 0, 1700, 540);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
  }

  createLevel() {
    this.platforms = this.physics.add.staticGroup();

    const platformData = [
      { x: 160, y: 510, scaleX: 2.2 },
      { x: 470, y: 430, scaleX: 1.2 },
      { x: 720, y: 350, scaleX: 1.1 },
      { x: 980, y: 450, scaleX: 1.4 },
      { x: 1310, y: 510, scaleX: 3.6 },
    ];

    platformData.forEach((platform) => {
      const sprite = this.platforms.create(platform.x, platform.y, 'platform-placeholder');
      sprite.setScale(platform.scaleX, 1).refreshBody();
    });

    this.createBossArena();

    this.add.text(34, 34, `${GAME_DATA.level.name} - Arena de Kaizen`, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#9bb6c8',
    }).setScrollFactor(0);
  }

  createBossArena() {
    const { left, right } = GAME_DATA.boss.arena;

    this.add.rectangle((left + right) / 2, 500, right - left, 10, 0x7be7ff, 0.12);
    this.add.rectangle(left, 440, 10, 140, 0x5d3fd3, 0.35);
    this.add.rectangle(right, 440, 10, 140, 0x5d3fd3, 0.35);

    this.add.text((left + right) / 2, 392, 'Arena do Guardião da Névoa', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#b9a7ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  createPlayer() {
    this.player = new Player(this, 90, 420);
    this.applyProgressionStatsToPlayer();
    this.physics.add.collider(this.player, this.platforms);
  }

  applyProgressionStatsToPlayer() {
    const stats = this.progressionSystem.getDerivedStats();

    this.player.maxHealth = stats.maxHealth;
    this.player.health = stats.maxHealth;
    this.player.maxEnergy = stats.maxEnergy;
    this.player.energy = stats.maxEnergy;
    this.player.dashCooldown = Math.max(300, this.player.dashCooldown - stats.dashCooldownReduction);
    this.player.attackDamage += stats.attackBonus;
    this.player.projectileDamage += stats.shurikenDamageBonus;
    this.player.shurikenCooldownReduction = stats.shurikenCooldownReduction;
  }

  createEnemies() {
    this.enemies = this.physics.add.group();
    this.bosses = this.physics.add.group();
    this.enemyProjectiles = this.physics.add.group();

    this.addEnemy(new Enemy(this, 410, 450, 'weakNinja'));
    this.addEnemy(new Enemy(this, 650, 370, 'kunaiShooter'));
    this.addEnemy(new Enemy(this, 930, 390, 'shadowNinja'));

    this.boss = new Boss(this, 1340, 430);
    this.addEnemy(this.boss, true);

    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.bosses, this.platforms);
  }

  addEnemy(enemy, isBoss = false) {
    const group = isBoss ? this.bosses : this.enemies;
    group.add(enemy);

    enemy.on('enemy-defeated', (defeatedEnemy) => {
      this.dropRewards(defeatedEnemy);
    });

    if (isBoss) {
      enemy.on('boss-defeated', (boss) => {
        this.handleBossDefeated(boss);
      });
    }
  }

  spawnBossMinion(x, y) {
    const minion = new Enemy(this, x, y, 'weakNinja', {
      health: 28,
      damage: 8,
      speed: 120,
      dropCoins: 1,
      dropXp: 1,
    });

    this.addEnemy(minion);
    this.physics.add.collider(minion, this.platforms);
    this.createSummonEffect(x, y);
  }

  createSummonEffect(x, y) {
    const effect = this.add.circle(x, y, 26, 0xb9a7ff, 0.45);
    effect.setBlendMode(Phaser.BlendModes.ADD);

    this.tweens.add({
      targets: effect,
      alpha: 0,
      scale: 2,
      duration: 360,
      onComplete: () => effect.destroy(),
    });
  }

  createCollectibles() {
    this.collectibles = this.physics.add.group();

    const coinPositions = [
      [260, 455],
      [470, 380],
      [720, 300],
      [980, 400],
      [1160, 455],
      [1420, 455],
      [1530, 455],
    ];

    coinPositions.forEach(([x, y]) => {
      this.collectibles.add(new Collectible(this, x, y, 1, 'coin'));
    });
  }

  createHud() {
    this.healthText = this.add.text(24, 68, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f2fbff',
    }).setScrollFactor(0);

    this.energyText = this.add.text(24, 94, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#7be7ff',
    }).setScrollFactor(0);

    this.coinText = this.add.text(24, 120, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffd166',
    }).setScrollFactor(0);

    this.helpText = this.add.text(24, 504, 'J combo, L shuriken, I Orbe do Vento', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#9bb6c8',
    }).setScrollFactor(0);
  }

  createBossHud() {
    this.bossNameText = this.add.text(480, 18, GAME_DATA.boss.name, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0);

    this.bossBarBack = this.add.rectangle(480, 44, 560, 18, 0x200814, 0.95)
      .setStrokeStyle(2, 0xb9a7ff)
      .setScrollFactor(0);

    this.bossBarFill = this.add.rectangle(200, 44, 560, 14, 0xff5c8a, 0.95)
      .setOrigin(0, 0.5)
      .setScrollFactor(0);

    this.bossPhaseText = this.add.text(480, 66, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#b9a7ff',
    }).setOrigin(0.5).setScrollFactor(0);
  }

  createCollisions() {
    this.projectiles = this.physics.add.group();
    this.meleeHitboxes = this.physics.add.group();

    this.physics.add.overlap(this.player, this.collectibles, (_player, collectible) => {
      if (collectible.type === 'xp') {
        this.levelXp += collectible.value;
      } else {
        this.levelCoins += collectible.value;
      }

      collectible.destroy();
    });

    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      player.takeDamage(Math.ceil(enemy.damage * 0.45));
    });

    this.physics.add.overlap(this.player, this.bosses, (player, boss) => {
      player.takeDamage(Math.ceil(boss.damage * 0.55));
    });

    this.physics.add.overlap(this.player, this.enemyProjectiles, (player, projectile) => {
      player.takeDamage(projectile.damage);
      projectile.destroy();
    });

    this.physics.add.overlap(this.meleeHitboxes, this.enemies, this.handleHitboxOverlap, undefined, this);
    this.physics.add.overlap(this.meleeHitboxes, this.bosses, this.handleHitboxOverlap, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileOverlap, undefined, this);
    this.physics.add.overlap(this.projectiles, this.bosses, this.handleProjectileOverlap, undefined, this);
  }

  update(time, delta) {
    if (this.isLevelFinished) return;

    this.player.update(this.inputSystem, delta);

    this.enemies.children.iterate((enemy) => enemy?.update(this.player, this.enemyProjectiles));
    this.bosses.children.iterate((boss) => boss?.update(this.player, {
      enemyProjectiles: this.enemyProjectiles,
      spawnBossMinion: this.spawnBossMinion.bind(this),
    }));
    this.collectibles.children.iterate((collectible) => collectible?.update(time));

    if (this.inputSystem.wantsAttack()) {
      this.handlePlayerComboAttack();
    }

    if (this.inputSystem.wantsProjectile()) {
      this.handlePlayerShuriken();
    }

    if (this.inputSystem.wantsSpecial()) {
      this.handlePlayerSpecial();
    }

    this.updateHud();
    this.updateBossHud();
    this.checkLevelState();
  }

  handlePlayerComboAttack() {
    const combatConfig = GAME_DATA.player.combat;
    if (!this.player.canAttack) return;

    this.player.canAttack = false;
    const comboStep = { ...this.player.getNextComboStep() };
    comboStep.damage += this.progressionSystem.getDerivedStats().attackBonus;
    const hitbox = this.combatSystem.createComboHitbox(this.player, comboStep);
    this.meleeHitboxes.add(hitbox);

    this.time.delayedCall(combatConfig.comboCooldown, () => {
      this.player.canAttack = true;
    });
  }

  handlePlayerShuriken() {
    const config = GAME_DATA.player.combat.shuriken;

    if (!this.player.canThrowShuriken) return;
    if (!this.player.spendEnergy(config.energyCost)) return;

    this.player.canThrowShuriken = false;
    this.combatSystem.createShuriken(this.player, this.projectiles);

    const cooldown = Math.max(180, config.cooldown - (this.player.shurikenCooldownReduction ?? 0));
    this.time.delayedCall(cooldown, () => {
      this.player.canThrowShuriken = true;
    });
  }

  handlePlayerSpecial() {
    const config = GAME_DATA.player.combat.special;

    if (!this.player.canUseSpecial) return;
    if (!this.player.spendEnergy(config.energyCost)) return;

    this.player.canUseSpecial = false;
    this.combatSystem.createWindOrb(this.player, this.projectiles);
    this.cameras.main.shake(120, 0.0035);

    this.time.delayedCall(config.cooldown, () => {
      this.player.canUseSpecial = true;
    });
  }

  handleHitboxOverlap(hitbox, enemy) {
    if (!hitbox.active || !enemy.active || enemy.isDefeated) return;
    if (hitbox.alreadyHit.has(enemy)) return;

    hitbox.alreadyHit.add(enemy);
    this.combatSystem.applyDamage(enemy, hitbox.damage, hitbox);
    hitbox.owner?.gainEnergy?.(GAME_DATA.player.combat.comboSteps[0].energyGain ?? 5);
  }

  handleProjectileOverlap(projectile, enemy) {
    if (!projectile.active || !enemy.active || enemy.isDefeated) return;

    this.combatSystem.applyDamage(enemy, projectile.damage, projectile);

    if (!projectile.pierce) {
      projectile.destroy();
    }
  }

  dropRewards(enemy) {
    for (let i = 0; i < enemy.dropCoins; i += 1) {
      const coin = new Collectible(
        this,
        enemy.x + Phaser.Math.Between(-22, 22),
        enemy.y + Phaser.Math.Between(-20, 10),
        1,
        'coin',
      );
      this.collectibles.add(coin);
    }

    for (let i = 0; i < enemy.dropXp; i += 1) {
      const xp = new Collectible(
        this,
        enemy.x + Phaser.Math.Between(-18, 18),
        enemy.y + Phaser.Math.Between(-26, 0),
        1,
        'xp',
      );
      this.collectibles.add(xp);
    }
  }

  handleBossDefeated() {
    if (this.bossRewardApplied) return;

    this.bossRewardApplied = true;
    this.levelCoins += GAME_DATA.boss.rewards.coins;
    this.levelXp += GAME_DATA.boss.rewards.xp;
    this.cameras.main.shake(240, 0.006);
  }

  updateHud() {
    this.healthText.setText(`Vida: ${this.player.health}/${this.player.maxHealth}`);
    this.energyText.setText(`Energia: ${Math.floor(this.player.energy)}/${this.player.maxEnergy}`);
    this.coinText.setText(`Moedas: ${this.levelCoins}/${GAME_DATA.level.targetCoins} | XP: ${this.levelXp}`);
  }

  updateBossHud() {
    if (!this.boss || !this.boss.active) {
      this.bossBarFill.width = 0;
      this.bossPhaseText.setText('Kaizen derrotado');
      return;
    }

    const healthRatio = Phaser.Math.Clamp(this.boss.health / this.boss.maxHealth, 0, 1);
    this.bossBarFill.width = 560 * healthRatio;
    this.bossPhaseText.setText(`Fase ${this.boss.phase}/3`);
  }

  checkLevelState() {
    if (this.player.isDefeated) {
      this.isLevelFinished = true;
      this.scene.start('GameOverScene', { coins: this.levelCoins });
      return;
    }

    const bossDefeated = !this.boss.active || this.boss.isDefeated;

    if (bossDefeated) {
      this.isLevelFinished = true;
      this.progressionSystem.completeLevel(GAME_DATA.level.name, this.levelCoins, this.levelXp, {
        rareScrolls: 1,
        specialItem: GAME_DATA.boss.rewards.specialItem,
        unlockedSkill: GAME_DATA.boss.rewards.unlockedSkill,
      });
      this.scene.start('VictoryScene', {
        coins: this.levelCoins,
        xp: this.levelXp,
        levelName: GAME_DATA.level.name,
        defeatedBoss: GAME_DATA.boss.name,
        specialItem: GAME_DATA.boss.rewards.specialItem,
        unlockedSkill: GAME_DATA.boss.rewards.unlockedSkill,
      });
    }
  }
}
