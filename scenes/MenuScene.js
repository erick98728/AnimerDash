import { GAME_DATA } from '../data/gameData.js';
import AudioSystem, { AUDIO_KEYS } from '../systems/AudioSystem.js';
import FullscreenSystem from '../systems/FullscreenSystem.js';
import RetentionSystem from '../systems/RetentionSystem.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Inicializa retenção no menu para atualizar sequência de login automaticamente.
    this.retentionSystem = new RetentionSystem();
    this.audioSystem = new AudioSystem(this);
    this.audioSystem.playMusic(AUDIO_KEYS.music.menu);
    const loginInfo = this.retentionSystem.getLoginRewardInfo();

    this.add.image(480, 270, 'mist-bg-placeholder');

    this.add.text(480, 70, GAME_DATA.title, {
      fontFamily: 'Arial',
      fontSize: '54px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(480, 124, 'Ação ninja 2D original', {
      fontFamily: 'Arial',
      fontSize: '21px',
      color: '#9bb6c8',
    }).setOrigin(0.5);

    this.add.text(480, 158, `Sequência de login: ${loginInfo.streak}/7`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffd166',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.fullscreenStatusText = this.add.text(480, 492, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffd166',
      align: 'center',
    }).setOrigin(0.5);

    this.createButton(480, 216, 'Selecionar fase', () => {
      this.audioSystem.stopMusic();
      this.scene.start('LevelSelectScene');
    });

    this.createButton(480, 272, 'Melhorias', () => {
      this.audioSystem.stopMusic();
      this.scene.start('UpgradeScene');
    });

    this.createButton(480, 328, 'Missões e recompensas', () => {
      this.audioSystem.stopMusic();
      this.scene.start('RetentionScene');
    });

    this.createButton(480, 384, 'Configurações', () => {
      this.scene.launch('SettingsScene', { returnScene: 'MenuScene' });
      this.scene.bringToTop('SettingsScene');
    });

    this.createButton(480, 440, 'Tela cheia', async () => {
      const result = await FullscreenSystem.toggle();
      this.showFullscreenStatus(result.message, result.ok);
    });

    this.add.text(480, 520, 'WASD/setas, Espaço, J, K, L, I | Mobile: botões virtuais', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#7be7ff',
    }).setOrigin(0.5);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.audioSystem?.stopMusic();
    });
  }

  showFullscreenStatus(message, isOk = true) {
    this.fullscreenStatusText.setColor(isOk ? '#ffd166' : '#ff8fab');
    this.fullscreenStatusText.setText(message);

    this.time.delayedCall(3200, () => {
      if (this.fullscreenStatusText?.active) {
        this.fullscreenStatusText.setText('');
      }
    });
  }

  createButton(x, y, label, callback) {
    const button = this.add.rectangle(x, y, 300, 44, 0x18324a, 0.95)
      .setStrokeStyle(2, 0x7be7ff)
      .setInteractive({ useHandCursor: true });

    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '19px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.on('pointerover', () => button.setFillStyle(0x24506f));
    button.on('pointerout', () => button.setFillStyle(0x18324a));
    button.on('pointerdown', () => {
      this.audioSystem?.unlock();
      callback();
    });

    return { button, text };
  }
}
