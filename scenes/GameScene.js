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
    this.physics.world.setBounds(0, 0, 1600, 540);

    this.combatSystem = new CombatSystem(this);
    this.inputSystem = new InputSystem(this);
    this.progressionSystem = new ProgressionSystem();
    this.levelCoins = 0;
    this.isLevelFinished = false;

    this.createLevel();
    this.createPlayer();
    this.createEnemies();
    this.createCollectibles();
    this.createHud();
    this.createCollisions();

    this.cameras.main.setBounds(0, 0, 1600, 540);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  createLevel() {
    this.platforms = this.physics.add.staticGroup();

    const platformData = [
      { x: 160, y: 510, scaleX: 2.2 },
      { x: 470, y: 430, scaleX: 1.2 },
      { x: 720, y: 350, scaleX: 1.1 },
      { x: 980, y: 450, scaleX: 1.4 },
      { x: 1260, y: 370, scaleX: 1.2 },
      { x: 1460, y: 510, scaleX: 2.0 },
    ];

    platformData.forEach((platform) => {
      const sprite = this.platforms.create(platform.x, platform.y, 'platform-placeholder');
      sprite.setScale(platform.scaleX, 1).refreshBody();
    });

    this.add.text(34, 34, GAME_DATA.level.name, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#9bb6c8',
    }).setScrollFactor(0);
  }

  createPlayer() {
    this.player = new Player(this, 90, 420);
    this.physics.add.collider(this.player, this.platforms);
  }

  createEnemies() {
    this.enemies = this.physics.add.group();
    this.bosses = this.physics.add.group();

    this.enemies.add(new Enemy(this, 520, 370));
    this.enemies.add(new Enemy(this, 760, 290, { speed: 65, patrolDistance: 90 }));
    this.enemies.add(new Enemy(this, 1030, 390, { health: 55, damage: 14 }));

    this.boss = new Boss(this, 1450, 430);
    this.bosses.add(this.boss);

    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.bosses, this.platforms);
  }

  createCollectibles() {
    this.collectibles = this.physics.add.group();

    const coinPositions = [
      [260, 455],
      [470, 380],
      [720, 300],
      [980, 400],
      [1120, 390],
      [1260, 320],
      [1370, 450],
      [1510, 455],
    ];

    coinPositions.forEach(([x, y]) => {
      this.collectibles.add(new Collectible(this, x, y, 1));
    });
  }

  createHud() {
    this.healthText = this.add.text(24, 68, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f2fbff',
    }).setScrollFactor(0);

    this.coinText = this.add.text(24, 94, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffd166',
    }).setScrollFactor(0);

    this.bossText = this.add.text(24, 120, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ff8fab',
    }).setScrollFactor(0);
  }

  createCollisions() {
    this.projectiles = this.physics.add.group();

    this.physics.add.overlap(this.player, this.collectibles, (_player, collectible) => {
      this.levelCoins += collectible.value;
      collectible.destroy();
    });

    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      player.takeDamage(enemy.damage);
    });

    this.physics.add.overlap(this.player, this.bosses, (player, boss) => {
      player.takeDamage(boss.damage);
    });

    this.physics.add.overlap(this.projectiles, this.enemies, (projectile, enemy) => {
      this.combatSystem.applyDamage(enemy, projectile.damage);
      projectile.destroy();
    });

    this.physics.add.overlap(this.projectiles, this.bosses, (projectile, boss) => {
      this.combatSystem.applyDamage(boss, projectile.damage);
      projectile.destroy();
    });
  }

  update(time) {
    if (this.isLevelFinished) return;

    this.player.update(this.inputSystem);
    this.enemies.children.iterate((enemy) => enemy?.update());
    this.bosses.children.iterate((boss) => boss?.update(this.player));
    this.collectibles.children.iterate((collectible) => collectible?.update(time));

    if (this.inputSystem.wantsAttack()) {
      this.handlePlayerAttack();
    }

    if (this.inputSystem.wantsProjectile()) {
      this.combatSystem.createProjectile(this.player, this.projectiles, this.player.projectileDamage);
    }

    this.updateHud();
    this.checkLevelState();
  }

  handlePlayerAttack() {
    const hitbox = this.combatSystem.createMeleeHitbox(this.player, this.player.attackDamage);

    this.physics.add.overlap(hitbox, this.enemies, (box, enemy) => {
      this.combatSystem.applyDamage(enemy, box.damage);
    });

    this.physics.add.overlap(hitbox, this.bosses, (box, boss) => {
      this.combatSystem.applyDamage(boss, box.damage);
    });
  }

  updateHud() {
    this.healthText.setText(`Vida: ${this.player.health}/${this.player.maxHealth}`);
    this.coinText.setText(`Moedas da fase: ${this.levelCoins}/${GAME_DATA.level.targetCoins}`);
    this.bossText.setText(this.boss?.active ? `Chefe: ${this.boss.health}/${this.boss.maxHealth}` : 'Chefe derrotado');
  }

  checkLevelState() {
    if (this.player.isDefeated) {
      this.isLevelFinished = true;
      this.scene.start('GameOverScene', { coins: this.levelCoins });
      return;
    }

    const bossDefeated = !this.boss.active || this.boss.isDefeated;
    const enoughCoins = this.levelCoins >= GAME_DATA.level.targetCoins;

    if (bossDefeated && enoughCoins) {
      this.isLevelFinished = true;
      this.progressionSystem.completeLevel(GAME_DATA.level.name, this.levelCoins);
      this.scene.start('VictoryScene', { coins: this.levelCoins, levelName: GAME_DATA.level.name });
    }
  }
}
