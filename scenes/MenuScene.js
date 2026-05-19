import { GAME_DATA } from '../data/gameData.js';
import AudioSystem, { AUDIO_KEYS } from '../systems/AudioSystem.js';
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

    this.add.text(480, 80, GAME_DATA.title, {
      fontFamily: 'Arial',
      fontSize: '58px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(480, 138, 'Ação ninja 2D original', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#9bb6c8',
    }).setOrigin(0.5);

    this.add.text(480, 174, `Sequência de login: ${loginInfo.streak}/7`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffd166',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.createButton(480, 238, 'Selecionar fase', () => {
      this.audioSystem.stopMusic();
      this.scene.start('LevelSelectScene');
    });

    this.createButton(480, 296, 'Melhorias', () => {
      this.audioSystem.stopMusic();
      this.scene.start('UpgradeScene');
    });

    this.createButton(480, 354, 'Missões e recompensas', () => {
      this.audioSystem.stopMusic();
      this.scene.start('RetentionScene');
    });

    this.createButton(480, 412, 'Configurações', () => {
      this.scene.launch('SettingsScene', { returnScene: 'MenuScene' });
      this.scene.bringToTop('SettingsScene');
    });

    this.add.text(480, 476, 'WASD ou setas, Espaço pula, J ataca, K esquiva, L shuriken, I especial', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#7be7ff',
    }).setOrigin(0.5);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.audioSystem?.stopMusic();
    });
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
    button.on('pointerdown', () => {
      this.audioSystem?.unlock();
      callback();
    });

    return { button, text };
  }
}
