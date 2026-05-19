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
    this.pauseOverlay = this.scene.add.rectangle(480, 270, 960, 540, 0x02050a, 0.72)
      .setScrollFactor(0)
      .setDepth(2000)
      .setVisible(false);

    this.pauseText = this.scene.add.text(480, 270, 'Jogo pausado\nToque ou volte para a aba para continuar', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#f2fbff',
      align: 'center',
      fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2001).setVisible(false);

    this.pauseOverlay.setInteractive({ useHandCursor: true });
    this.pauseOverlay.on('pointerdown', () => this.resumeGame());
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
    this.showOverlay(true);
  }

  resumeFromFocus() {
    if (!this.isPausedByFocus) return;
    this.resumeGame();
  }

  toggleManualPause() {
    if (this.isPausedByFocus) return;

    this.isManuallyPaused = !this.isManuallyPaused;
    if (this.isManuallyPaused) {
      this.pausePhysicsAndTweens();
      this.showOverlay(true);
    } else {
      this.resumeGame();
    }
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

  showOverlay(isVisible) {
    this.pauseOverlay?.setVisible(isVisible);
    this.pauseText?.setVisible(isVisible);
  }

  isPaused() {
    return this.isPausedByFocus || this.isManuallyPaused;
  }
}
