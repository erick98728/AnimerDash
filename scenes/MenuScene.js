import { GAME_DATA } from '../data/gameData.js';
import AudioSystem, { AUDIO_KEYS } from '../systems/AudioSystem.js';
import FullscreenSystem from '../systems/FullscreenSystem.js';
import RetentionSystem from '../systems/RetentionSystem.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.retentionSystem = new RetentionSystem();
    this.audioSystem = new AudioSystem(this);
    this.audioSystem.playMusic(AUDIO_KEYS.music.menu);
    const loginInfo = this.retentionSystem.getLoginRewardInfo();

    this.menuItems = [];
    this.background = this.add.image(480, 270, 'mist-bg-placeholder');

    this.titleText = this.add.text(480, 70, GAME_DATA.title, {
      fontFamily: 'Arial',
      fontSize: '54px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.subtitleText = this.add.text(480, 124, 'Ação ninja 2D original', {
      fontFamily: 'Arial',
      fontSize: '21px',
      color: '#9bb6c8',
    }).setOrigin(0.5);

    this.loginText = this.add.text(480, 158, `Sequência de login: ${loginInfo.streak}/7`, {
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

    this.levelButton = this.createButton(480, 216, 'Selecionar fase', () => {
      this.audioSystem.stopMusic();
      this.scene.start('LevelSelectScene');
    });

    this.upgradeButton = this.createButton(480, 272, 'Melhorias', () => {
      this.audioSystem.stopMusic();
      this.scene.start('UpgradeScene');
    });

    this.retentionButton = this.createButton(480, 328, 'Missões e recompensas', () => {
      this.audioSystem.stopMusic();
      this.scene.start('RetentionScene');
    });

    this.settingsButton = this.createButton(480, 384, 'Configurações', () => {
      this.scene.launch('SettingsScene', { returnScene: 'MenuScene' });
      this.scene.bringToTop('SettingsScene');
    });

    this.fullscreenButton = this.createButton(480, 440, 'Tela cheia', async () => {
      const result = await FullscreenSystem.toggle();
      this.showFullscreenStatus(result.message, result.ok);
    });

    this.helpText = this.add.text(480, 520, 'WASD/setas, Espaço, J, K, L, I | Mobile: botões virtuais', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#7be7ff',
    }).setOrigin(0.5);

    this.refreshLayout();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.audioSystem?.stopMusic();
    });
  }

  refreshLayout() {
    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width / 2;
    const centerY = height / 2;

    this.background?.setPosition(centerX, centerY);
    if (this.background) {
      const source = this.textures.get('mist-bg-placeholder')?.getSourceImage?.();
      const scaleX = source?.width ? width / source.width : 1;
      const scaleY = source?.height ? height / source.height : 1;
      this.background.setScale(Math.max(scaleX, scaleY));
    }

    const topOffset = height <= 360 ? 8 : 0;
    this.titleText?.setPosition(centerX, 70 + topOffset);
    this.subtitleText?.setPosition(centerX, 124 + topOffset);
    this.loginText?.setPosition(centerX, 158 + topOffset);

    const buttonYs = [216, 272, 328, 384, 440].map((y) => Phaser.Math.Clamp(y + topOffset, 120, height - 88));
    [this.levelButton, this.upgradeButton, this.retentionButton, this.settingsButton, this.fullscreenButton].forEach((buttonGroup, index) => {
      this.positionButton(buttonGroup, centerX, buttonYs[index]);
    });

    this.fullscreenStatusText?.setPosition(centerX, height - 48);
    this.helpText?.setPosition(centerX, height - 20);
  }

  positionButton(buttonGroup, x, y) {
    if (!buttonGroup) return;
    buttonGroup.button.setPosition(x, y);
    buttonGroup.text.setPosition(x, y);
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
