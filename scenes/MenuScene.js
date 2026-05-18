import { GAME_DATA } from '../data/gameData.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.image(480, 270, 'mist-bg-placeholder');

    this.add.text(480, 115, GAME_DATA.title, {
      fontFamily: 'Arial',
      fontSize: '58px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(480, 178, 'Ação ninja 2D original', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#9bb6c8',
    }).setOrigin(0.5);

    this.createButton(480, 270, 'Iniciar fase', () => {
      this.scene.start('GameScene');
    });

    this.createButton(480, 338, 'Melhorias', () => {
      this.scene.start('UpgradeScene');
    });

    this.add.text(480, 455, 'WASD ou setas, Espaço pula, J ataca, K esquiva, L projétil', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#7be7ff',
    }).setOrigin(0.5);
  }

  createButton(x, y, label, callback) {
    const button = this.add.rectangle(x, y, 260, 48, 0x18324a, 0.95)
      .setStrokeStyle(2, 0x7be7ff)
      .setInteractive({ useHandCursor: true });

    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.on('pointerover', () => button.setFillStyle(0x24506f));
    button.on('pointerout', () => button.setFillStyle(0x18324a));
    button.on('pointerdown', callback);

    return { button, text };
  }
}
