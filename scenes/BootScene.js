import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Boss from '../entities/Boss.js';
import Projectile from '../entities/Projectile.js';
import EnemyProjectile from '../entities/EnemyProjectile.js';
import Collectible from '../entities/Collectible.js';
import AudioSystem from '../systems/AudioSystem.js';
import { COLORS } from '../data/gameData.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Futuramente, sprites reais devem ser carregados aqui.
    // Exemplo: this.load.image('ren-idle', './assets/sprites/ren-idle.png');
    AudioSystem.preload(this);
  }

  create() {
    Player.createTexture(this);
    Enemy.createTexture(this);
    Boss.createTexture(this);
    Projectile.createTexture(this);
    EnemyProjectile.createTexture(this);
    Collectible.createTexture(this);
    this.createWorldTextures();

    this.scene.start('MenuScene');
  }

  createWorldTextures() {
    if (!this.textures.exists('platform-placeholder')) {
      const platform = this.add.graphics();
      platform.fillStyle(COLORS.platform, 1);
      platform.fillRoundedRect(0, 0, 160, 28, 8);
      platform.generateTexture('platform-placeholder', 160, 28);
      platform.destroy();
    }

    if (!this.textures.exists('mist-bg-placeholder')) {
      const mist = this.add.graphics();
      mist.fillStyle(0x10223a, 1);
      mist.fillRect(0, 0, 960, 540);
      mist.fillStyle(0x5d3fd3, 0.22);
      mist.fillCircle(180, 120, 120);
      mist.fillCircle(760, 180, 160);
      mist.fillStyle(0x7be7ff, 0.12);
      mist.fillCircle(470, 310, 220);
      mist.generateTexture('mist-bg-placeholder', 960, 540);
      mist.destroy();
    }
  }
}
