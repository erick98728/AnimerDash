import AudioSystem, { AUDIO_KEYS } from '../systems/AudioSystem.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    this.audioSystem = new AudioSystem(this);
    this.audioSystem.playSfx(AUDIO_KEYS.sfx.defeat);
    this.add.image(480, 270, 'mist-bg-placeholder');

    this.add.text(480, 145, 'Você caiu na Névoa Vazia', {
      fontFamily: 'Arial',
      fontSize: '38px',
      color: '#ff8fab',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(480, 205, `Moedas coletadas nesta tentativa: ${data.coins ?? 0}`, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffd166',
    }).setOrigin(0.5);

    this.createButton(480, 300, 'Tentar novamente', () => {
      this.scene.start('GameScene', { levelId: data.levelId ?? 'level-01' });
    });

    this.createButton(480, 365, 'Voltar ao menu', () => {
      this.scene.start('MenuScene');
    });
  }

  createButton(x, y, label, callback) {
    const button = this.add.rectangle(x, y, 280, 48, 0x18324a, 0.95)
      .setStrokeStyle(2, 0x7be7ff)
      .setInteractive({ useHandCursor: true });

    this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '19px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.on('pointerover', () => button.setFillStyle(0x24506f));
    button.on('pointerout', () => button.setFillStyle(0x18324a));
    button.on('pointerdown', callback);
  }
}
