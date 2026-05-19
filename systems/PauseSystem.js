export default class PauseSystem {
  constructor(scene, inputSystem) {
    this.scene = scene;
    this.inputSystem = inputSystem;
    this.isPausedByFocus = false;
    this.isManuallyPaused = false;

    this.createOverlay();
    this.registerFocusEvents();
  }

  createOverlay() {
    this.pauseOverlay = this.scene.add.rectangle(480, 270, 960, 540, 0x02050a, 0.78)
      .setScrollFactor(0)
      .setDepth(2200)
      .setVisible(false);

    this.titleText = this.scene.add.text(480, 150, 'Jogo pausado', {
      fontFamily: 'Arial',
      fontSize: '34px',
      color: '#f2fbff',
      align: 'center',
      fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2201).setVisible(false);

    this.reasonText = this.scene.add.text(480, 188, '', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#9bb6c8',
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2201).setVisible(false);

    this.buttons = [
      this.createButton(480, 240, 'Continuar', () => this.resumeGame()),
      this.createButton(480, 296, 'Reiniciar fase', () => this.restartLevel()),
      this.createButton(480, 352, 'Configurações', () => this.openSettings()),
      this.createButton(480, 408, 'Voltar ao menu', () => this.returnToMenu()),
    ];
  }

  createButton(x, y, label, callback) {
    const button = this.scene.add.rectangle(x, y, 280, 42, 0x18324a, 0.96)
      .setStrokeStyle(2, 0x7be7ff, 0.9)
      .setScrollFactor(0)
      .setDepth(2201)
      .setVisible(false);

    const text = this.scene.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2202).setVisible(false);

    button.on('pointerover', () => button.setFillStyle(0x24506f, 0.96));
    button.on('pointerout', () => button.setFillStyle(0x18324a, 0.96));
    button.on('pointerdown', callback);

    return { button, text };
  }

  registerFocusEvents() {
    this.scene.game.events.on(Phaser.Core.Events.BLUR, this.pauseByFocus, this);
    this.scene.game.events.on(Phaser.Core.Events.FOCUS, this.resumeFromFocus, this);

    this.handleVisibilityChangeBound = () => {
      if (document.hidden) this.pauseByFocus();
      else this.resumeFromFocus();
    };

    document.addEventListener('visibilitychange', this.handleVisibilityChangeBound);

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.game.events.off(Phaser.Core.Events.BLUR, this.pauseByFocus, this);
      this.scene.game.events.off(Phaser.Core.Events.FOCUS, this.resumeFromFocus, this);
      document.removeEventListener('visibilitychange', this.handleVisibilityChangeBound);
    });
  }

  update(isLevelFinished = false) {
    if (this.inputSystem.wantsPause() && !isLevelFinished) {
      this.toggleManualPause();
    }
  }

  pauseByFocus() {
    if (this.scene.isLevelFinished) return;

    this.isPausedByFocus = true;
    this.pausePhysicsAndTweens();
    this.showOverlay(true, 'A pausa automática foi ativada porque o jogo perdeu o foco.');
  }

  resumeFromFocus() {
    if (!this.isPausedByFocus) return;
    this.showOverlay(true, 'Toque em Continuar para retomar com segurança.');
  }

  toggleManualPause() {
    if (this.isPausedByFocus) return;

    this.isManuallyPaused = !this.isManuallyPaused;
    if (this.isManuallyPaused) {
      this.pausePhysicsAndTweens();
      this.showOverlay(true, 'Escolha uma opção para continuar.');
    } else {
      this.resumeGame();
    }
  }

  pauseFromButton() {
    if (this.scene.isLevelFinished || this.isPaused()) return;

    this.isManuallyPaused = true;
    this.pausePhysicsAndTweens();
    this.showOverlay(true, 'Escolha uma opção para continuar.');
  }

  pausePhysicsAndTweens() {
    this.scene.physics.pause();
    this.scene.tweens.pauseAll();
    this.inputSystem.releaseAllTouchInputs();
  }

  resumeGame() {
    this.isPausedByFocus = false;
    this.isManuallyPaused = false;
    this.scene.physics.resume();
    this.scene.tweens.resumeAll();
    this.showOverlay(false);
  }

  restartLevel() {
    this.isPausedByFocus = false;
    this.isManuallyPaused = false;
    this.showOverlay(false);
    this.scene.physics.resume();
    this.scene.tweens.resumeAll();
    this.scene.scene.restart({ levelId: this.scene.levelData?.id ?? this.scene.selectedLevelId });
  }

  openSettings() {
    this.scene.scene.launch('SettingsScene', {
      returnScene: this.scene.scene.key,
      openedFromPause: true,
    });
    this.scene.scene.bringToTop('SettingsScene');
  }

  returnToMenu() {
    this.isPausedByFocus = false;
    this.isManuallyPaused = false;
    this.showOverlay(false);
    this.scene.physics.resume();
    this.scene.tweens.resumeAll();
    this.scene.scene.start('MenuScene');
  }

  showOverlay(isVisible, reason = '') {
    this.pauseOverlay?.setVisible(isVisible);
    this.titleText?.setVisible(isVisible);
    this.reasonText?.setVisible(isVisible).setText(reason);

    this.buttons.forEach(({ button, text }) => {
      button.setVisible(isVisible);
      text.setVisible(isVisible);

      if (isVisible) {
        button.setInteractive({ useHandCursor: true });
      } else {
        button.disableInteractive();
      }
    });
  }

  isPaused() {
    return this.isPausedByFocus || this.isManuallyPaused;
  }
}
