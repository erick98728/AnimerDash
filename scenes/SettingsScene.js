import SaveSystem from '../systems/SaveSystem.js';
import FullscreenSystem from '../systems/FullscreenSystem.js';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  init(data = {}) {
    this.returnScene = data.returnScene ?? 'MenuScene';
    this.openedFromPause = Boolean(data.openedFromPause);
  }

  create() {
    this.settings = SaveSystem.getSettings();

    this.add.rectangle(480, 270, 960, 540, 0x02050a, 0.86).setDepth(2500);
    this.add.rectangle(480, 270, 680, 480, 0x07111f, 0.96)
      .setStrokeStyle(3, 0x7be7ff, 0.75)
      .setDepth(2501);

    this.add.text(480, 52, 'Configurações', {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(2502);

    this.statusText = this.add.text(480, 502, '', {
      fontFamily: 'Arial',
      fontSize: '13px',
      color: '#ffd166',
      align: 'center',
    }).setOrigin(0.5).setDepth(2503);

    this.createVolumeControl(480, 104, 'Volume da música', 'musicVolume');
    this.createVolumeControl(480, 164, 'Volume dos efeitos', 'sfxVolume');
    this.createToggle(480, 224, 'Botões mobile', 'showTouchControls');
    this.createVolumeControl(480, 284, 'Opacidade dos botões', 'touchControlsOpacity', 0.25, 1);
    this.createToggle(480, 344, 'Ocultar ajuda no mobile', 'hideMobileGameplayHelp', 'Ocultar', 'Mostrar');

    this.createButton(352, 436, 'Tela cheia', async () => {
      const result = await FullscreenSystem.toggle();
      this.showStatus(result.message, result.ok);
    }, 210, 40);

    this.createButton(608, 436, 'Voltar', () => this.closeSettings(), 210, 40);
  }

  createVolumeControl(x, y, label, settingKey, min = 0, max = 1) {
    this.add.text(x - 250, y - 18, label, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setDepth(2502);

    const valueText = this.add.text(x + 236, y - 18, `${Math.round(this.settings[settingKey] * 100)}%`, {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#ffd166',
      fontStyle: 'bold',
    }).setOrigin(1, 0).setDepth(2502);

    this.createSmallButton(x - 110, y + 16, '-', () => {
      this.updateNumericSetting(settingKey, -0.1, min, max, valueText);
    });

    this.createSmallButton(x + 110, y + 16, '+', () => {
      this.updateNumericSetting(settingKey, 0.1, min, max, valueText);
    });

    this.add.rectangle(x, y + 16, 170, 10, 0x18324a, 1).setDepth(2502);
    const fill = this.add.rectangle(x - 85, y + 16, 170 * this.normalizeValue(this.settings[settingKey], min, max), 10, 0x7be7ff, 1)
      .setOrigin(0, 0.5)
      .setDepth(2503);

    valueText.progressFill = fill;
    valueText.progressMin = min;
    valueText.progressMax = max;
  }

  createToggle(x, y, label, settingKey, trueText = 'Mostrar', falseText = 'Ocultar') {
    this.add.text(x - 250, y - 12, label, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setDepth(2502);

    const valueText = this.add.text(x + 236, y - 12, this.settings[settingKey] ? trueText : falseText, {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#ffd166',
      fontStyle: 'bold',
    }).setOrigin(1, 0).setDepth(2502);

    this.createButton(x, y + 26, 'Alternar', () => {
      const nextValue = !this.settings[settingKey];
      this.settings[settingKey] = nextValue;
      SaveSystem.updateSettings({ [settingKey]: nextValue });
      valueText.setText(nextValue ? trueText : falseText);
      this.applyRuntimeSettings();
    }, 180, 34);
  }

  createSmallButton(x, y, label, callback) {
    return this.createButton(x, y, label, callback, 46, 32);
  }

  createButton(x, y, label, callback, width = 220, height = 42) {
    const button = this.add.rectangle(x, y, width, height, 0x18324a, 0.96)
      .setStrokeStyle(2, 0x7be7ff, 0.85)
      .setDepth(2502)
      .setInteractive({ useHandCursor: true });

    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(2503);

    button.on('pointerover', () => button.setFillStyle(0x24506f, 0.96));
    button.on('pointerout', () => button.setFillStyle(0x18324a, 0.96));
    button.on('pointerdown', callback);

    return { button, text };
  }

  updateNumericSetting(settingKey, delta, min, max, valueText) {
    const nextValue = Phaser.Math.Clamp((this.settings[settingKey] ?? 0) + delta, min, max);
    this.settings[settingKey] = Number(nextValue.toFixed(2));
    SaveSystem.updateSettings({ [settingKey]: this.settings[settingKey] });

    valueText.setText(`${Math.round(this.settings[settingKey] * 100)}%`);
    if (valueText.progressFill) {
      valueText.progressFill.width = 170 * this.normalizeValue(this.settings[settingKey], min, max);
    }

    this.applyRuntimeSettings();
  }

  normalizeValue(value, min, max) {
    return Phaser.Math.Clamp((value - min) / (max - min), 0, 1);
  }

  showStatus(message, isOk = true) {
    this.statusText.setColor(isOk ? '#ffd166' : '#ff8fab');
    this.statusText.setText(message);

    this.time.delayedCall(3200, () => {
      if (this.statusText?.active) {
        this.statusText.setText('');
      }
    });
  }

  applyRuntimeSettings() {
    const targetScene = this.scene.get(this.returnScene);
    targetScene?.touchControlsSystem?.applySettings?.();
    targetScene?.hudSystem?.applySettings?.();
    targetScene?.audioSystem?.refreshSettings?.();

    if (targetScene?.sound) {
      targetScene.sound.volume = Math.max(this.settings.musicVolume, this.settings.sfxVolume);
    }
  }

  closeSettings() {
    this.applyRuntimeSettings();
    this.scene.stop();
    this.scene.resume(this.returnScene);
  }
}
