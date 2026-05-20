import SaveSystem from './SaveSystem.js';
import { ASSET_MANIFEST, getTextureKey } from '../data/assetsManifest.js';

export default class HudSystem {
  constructor(scene, levelSystem) {
    this.scene = scene;
    this.levelSystem = levelSystem;
    this.settings = SaveSystem.getSettings();
    this.create();
    this.applySettings();
  }

  create() {
    this.healthIcon = this.createIcon(14, 86, ASSET_MANIFEST.ui.healthIcon, '❤️');
    this.energyIcon = this.createIcon(14, 112, ASSET_MANIFEST.ui.energyIcon, '◆');
    this.coinIcon = this.createIcon(14, 138, ASSET_MANIFEST.collectibles.coin, '●');

    this.healthText = this.scene.add.text(34, 78, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f2fbff',
    }).setScrollFactor(0);

    this.energyText = this.scene.add.text(34, 104, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#7be7ff',
    }).setScrollFactor(0);

    this.coinText = this.scene.add.text(34, 130, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffd166',
    }).setScrollFactor(0);

    this.helpText = this.scene.add.text(24, 504, 'Teclado: J combo, K dash, L shuriken, I Orbe | Mobile: botões na tela', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#9bb6c8',
    }).setScrollFactor(0);
  }

  createIcon(x, y, assetEntry, fallbackSymbol) {
    const textureKey = getTextureKey(this.scene, assetEntry, null);

    if (textureKey && this.scene.textures.exists(textureKey)) {
      const icon = this.scene.add.image(x, y, textureKey)
        .setScrollFactor(0)
        .setDisplaySize(18, 18);
      return icon;
    }

    return this.scene.add.text(x, y - 8, fallbackSymbol, {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#f2fbff',
    }).setScrollFactor(0);
  }

  isMobileScreen() {
    return this.scene.sys.game.device.input.touch || window.innerWidth <= 940;
  }

  applySettings() {
    this.settings = SaveSystem.getSettings();
    const hideHelp = this.isMobileScreen() && this.settings.hideMobileGameplayHelp;
    this.helpText.setVisible(!hideHelp);
  }

  update(player, levelCoins, levelXp) {
    const reward = this.levelSystem.getReward();

    this.healthText.setText(`Vida: ${player.health}/${player.maxHealth}`);
    this.energyText.setText(`Energia: ${Math.floor(player.energy)}/${player.maxEnergy}`);
    this.coinText.setText(`Coletado: ${levelCoins} moedas | XP: ${levelXp} | Recompensa: +${reward.coins ?? 0} moedas`);
    this.applySettings();
  }
}
