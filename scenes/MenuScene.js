import { GAME_DATA } from '../data/gameData.js';
import RetentionSystem from '../systems/RetentionSystem.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Inicializa retenção no menu para atualizar sequência de login automaticamente.
    this.retentionSystem = new RetentionSystem();
    const loginInfo = this.retentionSystem.getLoginRewardInfo();

    this.add.image(480, 270, 'mist-bg-placeholder');

    this.add.text(480, 90, GAME_DATA.title, {
      fontFamily: 'Arial',
      fontSize: '58px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(480, 150, 'Ação ninja 2D original', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#9bb6c8',
    }).setOrigin(0.5);

    this.add.text(480, 188, `Sequência de login: ${loginInfo.streak}/7`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffd166',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.createButton(480, 250, 'Iniciar fase', () => {
      this.scene.start('GameScene');
    });

    this.createButton(480, 312, 'Melhorias', () => {
      this.scene.start('UpgradeScene');
    });

    this.createButton(480, 374, 'Missões e recompensas', () => {
      this.scene.start('RetentionScene');
    });

    this.add.text(480, 462, 'WASD ou setas, Espaço pula, J ataca, K esquiva, L shuriken, I especial', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#7be7ff',
    }).setOrigin(0.5);
  }

  createButton(x, y, label, callback) {
    const button = this.add.rectangle(x, y, 300, 48, 0x18324a, 0.95)
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
