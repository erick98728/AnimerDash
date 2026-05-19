import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import AudioSystem, { AUDIO_KEYS } from '../systems/AudioSystem.js';
import BossHudSystem from '../systems/BossHudSystem.js';
import CollisionSystem from '../systems/CollisionSystem.js';
import CombatSystem from '../systems/CombatSystem.js';
import DialogueSystem from '../systems/DialogueSystem.js';
import DropSystem from '../systems/DropSystem.js';
import HudSystem from '../systems/HudSystem.js';
import InputSystem from '../systems/InputSystem.js';
import LevelSystem from '../systems/LevelSystem.js';
import PauseSystem from '../systems/PauseSystem.js';
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
    this.audioSystem = new AudioSystem(this);
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
    this.tutorialFlags = new Set();

    this.createLevel();
    this.createPlayer();
    this.createEnemies();
    this.createCollectibles();
    this.createCombatGroups();
    this.createSystems();
    this.startOpeningDialogues();
    this.startLevelMusic();

    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.audioSystem?.stopMusic();
    });
  }

  startLevelMusic() {
    const musicKey = this.levelSystem.requiresBossDefeat() ? AUDIO_KEYS.music.boss : AUDIO_KEYS.music.level;
    this.audioSystem.playMusic(musicKey);
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

  createCollectibles() {
    this.collectibles = this.physics.add.group();
    this.levelSystem.createCollectibles(this.collectibles);
  }

  createCombatGroups() {
    this.projectiles = this.physics.add.group();
    this.meleeHitboxes = this.physics.add.group();
  }

  createSystems() {
    this.dropSystem = new DropSystem(this, this.collectibles);
    this.hudSystem = new HudSystem(this, this.levelSystem);
    this.bossHudSystem = new BossHudSystem(this, this.levelSystem);
    this.pauseSystem = new PauseSystem(this, this.inputSystem);
    this.collisionSystem = new CollisionSystem(this);
    this.touchControlsSystem = new TouchControlsSystem(this, this.inputSystem);
    this.dialogueSystem = new DialogueSystem(this);
    this.collisionSystem.create();
  }

  startOpeningDialogues() {
    if (this.levelData.id === 'level-01') {
      this.time.delayedCall(260, () => this.dialogueSystem.start('tutorialMove', { once: true }));
    }

    if (this.levelData.id === 'boss-prototype') {
      this.time.delayedCall(260, () => this.dialogueSystem.start('kaizenIntro', { once: true }));
    }
  }

  addEnemy(enemy, isBoss = false) {
    const group = isBoss ? this.bosses : this.enemies;
    group.add(enemy);

    enemy.on('enemy-defeated', (defeatedEnemy) => {
      this.retentionSystem.recordEnemyDefeated(1);
      this.dropSystem?.dropRewards(defeatedEnemy);
    });

    if (isBoss) {
      enemy.on('boss-defeated', () => {
        this.handleBossDefeated();
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

  update(time, delta) {
    if (this.isLevelFinished) return;

    this.dialogueSystem.update();
    this.pauseSystem.update(this.isLevelFinished);
    if (this.pauseSystem.isPaused()) return;

    const isDialogueBlocking = this.dialogueSystem.isBlockingPlayer();

    if (!isDialogueBlocking) {
      this.player.update(this.inputSystem, delta);
      this.updateTutorialTriggers();

      if (this.inputSystem.wantsAttack()) {
        this.handlePlayerComboAttack();
      }

      if (this.inputSystem.wantsProjectile()) {
        this.handlePlayerShuriken();
      }

      if (this.inputSystem.wantsSpecial()) {
        this.handlePlayerSpecial();
      }
    } else {
      this.player.setVelocityX(0);
    }

    this.enemies.children.iterate((enemy) => enemy?.update(this.player, this.enemyProjectiles));
    this.bosses.children.iterate((boss) => boss?.update(this.player, {
      enemyProjectiles: this.enemyProjectiles,
      spawnBossMinion: this.spawnBossMinion.bind(this),
    }));
    this.collectibles.children.iterate((collectible) => collectible?.update(time));

    this.hudSystem.update(this.player, this.levelCoins, this.levelXp);
    this.bossHudSystem.update(this.boss);
    this.checkLevelState();
  }

  updateTutorialTriggers() {
    if (this.levelData.id !== 'level-01') return;
    if (this.dialogueSystem.isActive) return;

    const triggers = [
      { id: 'tutorialJump', condition: () => this.player.x > 250 },
      { id: 'tutorialAttack', condition: () => this.player.x > 380 },
      { id: 'tutorialDash', condition: () => this.player.x > 560 },
      { id: 'tutorialSpecial', condition: () => this.player.x > 820 },
    ];

    triggers.forEach((trigger) => {
      if (this.tutorialFlags.has(trigger.id)) return;
      if (!trigger.condition()) return;

      this.tutorialFlags.add(trigger.id);
      this.dialogueSystem.start(trigger.id, { once: true });
    });
  }

  handlePlayerComboAttack() {
    const combatConfig = GAME_DATA.player.combat;
    if (!this.player.canAttack) return;

    this.player.canAttack = false;
    const comboStep = { ...this.player.getNextComboStep() };
    comboStep.damage += this.player.attackDamageBonus ?? 0;
    const hitbox = this.combatSystem.createComboHitbox(this.player, comboStep);
    this.meleeHitboxes.add(hitbox);
    this.audioSystem.playSfx(AUDIO_KEYS.sfx.attack);

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
    this.audioSystem.playSfx(AUDIO_KEYS.sfx.shuriken);

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
    this.audioSystem.playSfx(AUDIO_KEYS.sfx.windOrb);
    this.cameras.main.shake(120, 0.0035);

    this.time.delayedCall(config.cooldown, () => {
      this.player.canUseSpecial = true;
    });
  }

  handleEndPointReached() {
    if (this.isLevelFinished) return;
    if (this.levelSystem.requiresBossDefeat() && this.boss?.active && !this.boss.isDefeated) return;
    if (this.levelSystem.requiresAllEnemiesDefeated() && this.enemies.countActive(true) > 0) return;

    this.finishLevel({ defeatedBoss: false });
  }

  handleBossDefeated() {
    if (this.bossRewardApplied) return;

    this.bossRewardApplied = true;
    this.retentionSystem.recordBossDefeated(1);
    this.cameras.main.shake(240, 0.006);
    this.dialogueSystem.start('kaizenDefeated', {
      onComplete: () => this.finishLevel({ defeatedBoss: true }),
    });
  }

  checkLevelState() {
    if (this.player.isDefeated) {
      this.isLevelFinished = true;
      this.audioSystem.stopMusic();
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

    this.audioSystem.stopMusic();
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
