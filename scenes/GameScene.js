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
    this.levelXp = 0;
    this.isLevelFinished = false;

    this.createLevel();
    this.createPlayer();
    this.createEnemies();
    this.createCollectibles();
    this.createHud();
    this.createCollisions();

    this.cameras.main.setBounds(0, 0, 1600, 540);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
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
    this.enemyProjectiles = this.physics.add.group();

    // Quatro tipos de inimigos do MVP.
    this.addEnemy(new Enemy(this, 410, 450, 'weakNinja'));
    this.addEnemy(new Enemy(this, 650, 370, 'kunaiShooter'));
    this.addEnemy(new Enemy(this, 930, 390, 'heavyGuardian'));
    this.addEnemy(new Enemy(this, 1190, 310, 'shadowNinja'));

    // Boss mantido como desafio final da fase.
    this.boss = new Boss(this, 1450, 430);
    this.boss.dropCoins = 6;
    this.boss.dropXp = 5;
    this.addEnemy(this.boss, true);

    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.bosses, this.platforms);
  }

  addEnemy(enemy, isBoss = false) {
    const group = isBoss ? this.bosses : this.enemies;
    group.add(enemy);

    // Quando o inimigo morre, ele solta moedas e XP.
    enemy.on('enemy-defeated', (defeatedEnemy) => {
      this.dropRewards(defeatedEnemy);
    });
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

    this.bossText = this.add.text(24, 146, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ff8fab',
    }).setScrollFactor(0);

    this.helpText = this.add.text(24, 504, 'J combo, L shuriken, I Orbe do Vento', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#9bb6c8',
    }).setScrollFactor(0);
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

    // Colisão corporal com inimigos. O dano principal de ataque dos inimigos fica no comportamento deles,
    // mas o contato ainda causa dano leve para evitar atravessar inimigos sem risco.
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      player.takeDamage(Math.ceil(enemy.damage * 0.45));
    });

    this.physics.add.overlap(this.player, this.bosses, (player, boss) => {
      player.takeDamage(boss.damage);
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

    // Envia o delta para o Player para aceleração, desaceleração e energia ficarem consistentes.
    this.player.update(this.inputSystem, delta);

    // Inimigos comuns recebem player e grupo de projéteis para controlar IA e ataques.
    this.enemies.children.iterate((enemy) => enemy?.update(this.player, this.enemyProjectiles));
    this.bosses.children.iterate((boss) => boss?.update(this.player));
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
    this.checkLevelState();
  }

  handlePlayerComboAttack() {
    const combatConfig = GAME_DATA.player.combat;
    if (!this.player.canAttack) return;

    this.player.canAttack = false;
    const comboStep = this.player.getNextComboStep();
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

    this.time.delayedCall(config.cooldown, () => {
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

  updateHud() {
    this.healthText.setText(`Vida: ${this.player.health}/${this.player.maxHealth}`);
    this.energyText.setText(`Energia: ${Math.floor(this.player.energy)}/${this.player.maxEnergy}`);
    this.coinText.setText(`Moedas: ${this.levelCoins}/${GAME_DATA.level.targetCoins} | XP: ${this.levelXp}`);
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
