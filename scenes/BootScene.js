import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Boss from '../entities/Boss.js';
import Projectile from '../entities/Projectile.js';
import EnemyProjectile from '../entities/EnemyProjectile.js';
import Collectible from '../entities/Collectible.js';
import AudioSystem from '../systems/AudioSystem.js';
import { COLORS } from '../data/gameData.js';
import { ASSET_MANIFEST, USE_REAL_ASSETS, flattenAssets } from '../data/assetsManifest.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Futuramente, sprites reais devem ser carregados aqui.
    AudioSystem.preload(this);
    this.preloadVisualAssets();
  }

  preloadVisualAssets() {
    if (!USE_REAL_ASSETS) return;

    flattenAssets(ASSET_MANIFEST).forEach((asset) => {
      if (this.textures.exists(asset.key)) return;

      if (asset.frameWidth && asset.frameHeight) {
        this.load.spritesheet(asset.key, asset.path, {
          frameWidth: asset.frameWidth,
          frameHeight: asset.frameHeight,
        });
        return;
      }

      this.load.image(asset.key, asset.path);
    });
  }

  create() {
    Player.createTexture(this);
    Enemy.createTexture(this);
    Boss.createTexture(this);
    Projectile.createTexture(this);
    EnemyProjectile.createTexture(this);
    Collectible.createTexture(this);
    this.createWorldTextures();
    this.createRealAssetAnimations();

    this.scene.start('MenuScene');
  }

  createRealAssetAnimations() {
    if (!USE_REAL_ASSETS) return;

    Player.createRealAssetAnimations?.(this);
    Enemy.createRealAssetAnimations?.(this);
    Boss.createRealAssetAnimations?.(this);
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
