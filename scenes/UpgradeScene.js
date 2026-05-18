import ProgressionSystem from '../systems/ProgressionSystem.js';
import { GAME_DATA } from '../data/gameData.js';

export default class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('UpgradeScene');
  }

  create() {
    this.progressionSystem = new ProgressionSystem();
    this.add.image(480, 270, 'mist-bg-placeholder');

    this.add.text(480, 74, 'Melhorias de Ren Kiro', {
      fontFamily: 'Arial',
      fontSize: '36px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.coinsText = this.add.text(480, 122, '', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffd166',
    }).setOrigin(0.5);

    this.createUpgradeButton(480, 205, 'Vida máxima', 'maxHealth');
    this.createUpgradeButton(480, 275, 'Dano do Corte Lunar', 'attackDamage');
    this.createUpgradeButton(480, 345, 'Energia espiritual', 'energy');

    this.createButton(480, 440, 'Voltar ao menu', () => {
      this.scene.start('MenuScene');
    });

    this.refreshText();
  }

  createUpgradeButton(x, y, label, upgradeName) {
    const cost = GAME_DATA.progression.upgradeCosts[upgradeName];
    const buttonLabel = `${label}, custo ${cost}`;

    this.createButton(x, y, buttonLabel, () => {
      this.progressionSystem.buyUpgrade(upgradeName);
      this.refreshText();
    });
  }

  createButton(x, y, label, callback) {
    const button = this.add.rectangle(x, y, 360, 48, 0x18324a, 0.95)
      .setStrokeStyle(2, 0x7be7ff)
      .setInteractive({ useHandCursor: true });

    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.on('pointerover', () => button.setFillStyle(0x24506f));
    button.on('pointerout', () => button.setFillStyle(0x18324a));
    button.on('pointerdown', callback);

    return { button, text };
  }

  refreshText() {
    const coins = this.progressionSystem.getCoins();
    this.coinsText.setText(`Moedas disponíveis: ${coins}`);
  }
}
