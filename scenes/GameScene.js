import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Collectible from '../entities/Collectible.js';
import CombatSystem from '../systems/CombatSystem.js';
import InputSystem from '../systems/InputSystem.js';
import LevelSystem from '../systems/LevelSystem.js';
import ProgressionSystem from '../systems/ProgressionSystem.js';
import RetentionSystem from '../systems/RetentionSystem.js';
import TouchControlsSystem from '../systems/TouchControlsSystem.js';
import { GAME_DATA } from '../data/gameData.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data = {}) {
    this.selectedLevelId = data.levelId ?? data.levelIndex ?? 'level-01';
  }

  create() {
    this.combatSystem = new CombatSystem(this);
    this.inputSystem = new InputSystem(this);
    this.levelSystem = new LevelSystem(this);
    this.progressionSystem = new ProgressionSystem();
    this.retentionSystem = new RetentionSystem();
    this.levelData = this.levelSystem.getLevel(this.selectedLevelId);
    this.levelCoins = 0;
    this.levelXp = 0;
    this.isLevelFinished = false;
    this.bossRewardApplied = false;
    this.isPausedByFocus = false;
    this.isManuallyPaused = false;

    this.createLevel();
    this.createPlayer();
    this.createEnemies();
    this.createCollectibles();
    this.createHud();
    this.createBossHud();
    this.createCollisions();
    this.createMobileControls();
    this.setupFocusPause();

    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
  }

  createLevel() {
    const builtLevel = this.levelSystem.build(this.levelData);
    this.platforms = builtLevel.platforms;
    this.obstacles = builtLevel.obstacles;
    this.endPoint = builtLevel.endPoint;
  }

  createPlayer() {
    const spawn = this.levelSystem.createPlayerSpawn();
    this.player = new Player(this, spawn.x, spawn.y);
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
    this.player.attackDamageBonus = stats.attackBonus;
    this.player.shurikenDamageBonus = stats.shurikenDamageBonus;
    this.player.specialDamageBonus = stats.specialDamageBonus;
    this.player.shurikenCooldownReduction = stats.shurikenCooldownReduction;
    this.player.shurikenMinimumCooldown = stats.shurikenMinimumCooldown;
  }

  createEnemies() {
    this.enemies = this.physics.add.group();
    this.bosses = this.physics.add.group();
    this.enemyProjectiles = this.physics.add.group();

    this.boss = this.levelSystem.createEnemies(this.addEnemy.bind(this));

    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.bosses, this.platforms);
  }

  addEnemy(enemy, isBoss = false) {
    const group = isBoss ? this.bosses : this.enemies;
    group.add(enemy);

    enemy.on('enemy-defeated', (defeatedEnemy) => {
      this.retentionSystem.recordEnemyDefeated(1);
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
    this.levelSystem.createCollectibles(this.collectibles);
  }

  createHud() {
    this.healthText = this.add.text(24, 78, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f2fbff',
    }).setScrollFactor(0);

    this.energyText = this.add.text(24, 104, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#7be7ff',
    }).setScrollFactor(0);

    this.coinText = this.add.text(24, 130, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffd166',
    }).setScrollFactor(0);

    this.helpText = this.add.text(24, 504, 'Teclado: J combo, K dash, L shuriken, I Orbe | Mobile: botões na tela', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#9bb6c8',
    }).setScrollFactor(0);
  }

  createBossHud() {
    if (!this.levelSystem.requiresBossDefeat()) {
      this.bossNameText = null;
      this.bossBarBack = null;
      this.bossBarFill = null;
      this.bossPhaseText = null;
      return;
    }

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

  createMobileControls() {
    this.touchControlsSystem = new TouchControlsSystem(this, this.inputSystem);
  }

  setupFocusPause() {
    this.pauseOverlay = this.add.rectangle(480, 270, 960, 540, 0x02050a, 0.72)
      .setScrollFactor(0)
      .setDepth(2000)
      .setVisible(false);

    this.pauseText = this.add.text(480, 270, 'Jogo pausado\nToque ou volte para a aba para continuar', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#f2fbff',
      align: 'center',
      fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2001).setVisible(false);

    this.pauseOverlay.setInteractive({ useHandCursor: true });
    this.pauseOverlay.on('pointerdown', () => this.resumeGame());

    this.game.events.on(Phaser.Core.Events.BLUR, this.pauseByFocus, this);
    this.game.events.on(Phaser.Core.Events.FOCUS, this.resumeFromFocus, this);
    document.addEventListener('visibilitychange', this.handleVisibilityChangeBound = () => {
      if (document.hidden) this.pauseByFocus();
      else this.resumeFromFocus();
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Phaser.Core.Events.BLUR, this.pauseByFocus, this);
      this.game.events.off(Phaser.Core.Events.FOCUS, this.resumeFromFocus, this);
      document.removeEventListener('visibilitychange', this.handleVisibilityChangeBound);
    });
  }

  pauseByFocus() {
    if (this.isLevelFinished) return;
    this.isPausedByFocus = true;
    this.physics.pause();
    this.tweens.pauseAll();
    this.inputSystem.releaseAllTouchInputs();
    this.showPauseOverlay(true);
  }

  resumeFromFocus() {
    if (!this.isPausedByFocus) return;
    this.resumeGame();
  }

  toggleManualPause() {
    if (this.isPausedByFocus) return;

    this.isManuallyPaused = !this.isManuallyPaused;
    if (this.isManuallyPaused) {
      this.physics.pause();
      this.tweens.pauseAll();
      this.inputSystem.releaseAllTouchInputs();
      this.showPauseOverlay(true);
    } else {
      this.resumeGame();
    }
  }

  resumeGame() {
    this.isPausedByFocus = false;
    this.isManuallyPaused = false;
    this.physics.resume();
    this.tweens.resumeAll();
    this.showPauseOverlay(false);
  }

  showPauseOverlay(isVisible) {
    this.pauseOverlay?.setVisible(isVisible);
    this.pauseText?.setVisible(isVisible);
  }

  createCollisions() {
    this.projectiles = this.physics.add.group();
    this.meleeHitboxes = this.physics.add.group();

    this.physics.add.overlap(this.player, this.collectibles, (_player, collectible) => {
      if (collectible.type === 'xp') {
        this.levelXp += collectible.value;
      } else {
        this.levelCoins += collectible.value;
        this.retentionSystem.recordCoinsCollected(collectible.value);
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

    this.physics.add.overlap(this.player, this.obstacles, (player, obstacle) => {
      this.handleObstacleOverlap(player, obstacle);
    });

    if (this.endPoint) {
      this.physics.add.overlap(this.player, this.endPoint, () => {
        this.handleEndPointReached();
      });
    }

    this.physics.add.overlap(this.meleeHitboxes, this.enemies, this.handleHitboxOverlap, undefined, this);
    this.physics.add.overlap(this.meleeHitboxes, this.bosses, this.handleHitboxOverlap, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileOverlap, undefined, this);
    this.physics.add.overlap(this.projectiles, this.bosses, this.handleProjectileOverlap, undefined, this);
  }

  handleObstacleOverlap(player, obstacle) {
    if (!obstacle.active || this.isLevelFinished) return;

    if (obstacle.type === 'pit') {
      player.takeDamage(player.maxHealth);
      return;
    }

    player.takeDamage(obstacle.damage ?? 10);
  }

  handleEndPointReached() {
    if (this.isLevelFinished) return;
    if (this.levelSystem.requiresBossDefeat() && this.boss?.active && !this.boss.isDefeated) return;
    if (this.levelSystem.requiresAllEnemiesDefeated() && this.enemies.countActive(true) > 0) return;

    this.finishLevel({ defeatedBoss: false });
  }

  update(time, delta) {
    if (this.isLevelFinished) return;

    if (this.inputSystem.wantsPause()) {
      this.toggleManualPause();
    }

    if (this.isPausedByFocus || this.isManuallyPaused) return;

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
    comboStep.damage += this.player.attackDamageBonus ?? 0;
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

    const minimumCooldown = this.player.shurikenMinimumCooldown ?? 180;
    const cooldown = Math.max(minimumCooldown, config.cooldown - (this.player.shurikenCooldownReduction ?? 0));
    this.time.delayedCall(cooldown, () => {
      this.player.canThrowShuriken = true;
    });
  }

  handlePlayerSpecial() {
    const config = GAME_DATA.player.combat.special;

    if (!this.player.canUseSpecial) return;
    if (!this.player.spendEnergy(config.energyCost)) return;

    this.player.canUseSpecial = false;
    this.retentionSystem.recordSpecialUse(1);
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
    hitbox.owner?.gainEnergy?.(hitbox.energyGain ?? 0);
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
    this.retentionSystem.recordBossDefeated(1);
    this.cameras.main.shake(240, 0.006);
    this.finishLevel({ defeatedBoss: true });
  }

  updateHud() {
    const reward = this.levelSystem.getReward();
    this.healthText.setText(`Vida: ${this.player.health}/${this.player.maxHealth}`);
    this.energyText.setText(`Energia: ${Math.floor(this.player.energy)}/${this.player.maxEnergy}`);
    this.coinText.setText(`Coletado: ${this.levelCoins} moedas | XP: ${this.levelXp} | Recompensa: +${reward.coins ?? 0} moedas`);
  }

  updateBossHud() {
    if (!this.levelSystem.requiresBossDefeat()) return;

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
      this.scene.start('GameOverScene', { coins: this.levelCoins, levelId: this.levelData.id });
    }
  }

  finishLevel({ defeatedBoss = false } = {}) {
    if (this.isLevelFinished) return;

    this.isLevelFinished = true;
    const reward = this.levelSystem.getReward();
    const earnedCoins = this.levelCoins + (reward.coins ?? 0);
    const earnedXp = this.levelXp + (reward.xp ?? 0);

    this.retentionSystem.recordLevelCompleted({ noDeath: !this.player.isDefeated });
    this.progressionSystem.completeLevel(this.levelData.id, earnedCoins, earnedXp, {
      rareScrolls: reward.rareScrolls ?? 0,
      specialItem: reward.specialItem,
      unlockedSkill: reward.unlockedSkill,
    });

    this.scene.start('VictoryScene', {
      coins: earnedCoins,
      xp: earnedXp,
      levelName: this.levelData.name,
      levelId: this.levelData.id,
      defeatedBoss: defeatedBoss ? GAME_DATA.boss.name : null,
      specialItem: reward.specialItem,
      unlockedSkill: reward.unlockedSkill,
    });
  }
}
