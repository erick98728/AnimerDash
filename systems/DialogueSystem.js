import { getDialogue } from '../data/dialogues.js';

export default class DialogueSystem {
  constructor(scene) {
    this.scene = scene;
    this.isActive = false;
    this.currentLines = [];
    this.currentIndex = 0;
    this.onComplete = null;
    this.triggeredDialogues = new Set();
    this.lastAdvanceAt = 0;
    this.lastFinishedAt = 0;
    this.activeOptions = {};

    this.createBox();
    this.registerInputs();
    this.refreshLayout();
  }

  createBox() {
    this.container = this.scene.add.container(480, 432).setScrollFactor(0).setDepth(1800).setVisible(false);

    this.backdrop = this.scene.add.rectangle(0, 0, 820, 138, 0x07111f, 0.92)
      .setStrokeStyle(3, 0x7be7ff, 0.75);

    this.speakerText = this.scene.add.text(-380, -52, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffd166',
      fontStyle: 'bold',
    });

    this.bodyText = this.scene.add.text(-380, -18, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f2fbff',
      wordWrap: { width: 740 },
      lineSpacing: 6,
    });

    this.hintText = this.scene.add.text(380, 48, 'Clique, toque ou pressione Espaço/J para avançar', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#9bb6c8',
    }).setOrigin(1, 0.5);

    this.container.add([this.backdrop, this.speakerText, this.bodyText, this.hintText]);
  }

  refreshLayout() {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const boxWidth = Phaser.Math.Clamp(width - 140, 720, Math.min(1080, width - 64));
    const boxHeight = 138;
    const left = -boxWidth / 2 + 30;
    const textWidth = boxWidth - 80;

    this.container.setPosition(width / 2, height - 108);
    this.backdrop.setSize(boxWidth, boxHeight);
    this.speakerText.setPosition(left, -52);
    this.bodyText.setPosition(left, -18);
    this.bodyText.setWordWrapWidth(textWidth);
    this.hintText.setPosition(boxWidth / 2 - 30, 48);
  }

  registerInputs() {
    this.advanceKeys = this.scene.input.keyboard.addKeys({
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      attack: Phaser.Input.Keyboard.KeyCodes.J,
    });

    this.scene.input.on('pointerdown', this.handlePointerAdvance, this);

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.input.off('pointerdown', this.handlePointerAdvance, this);
    });
  }

  handlePointerAdvance(pointer) {
    if (!this.isActive) return;
    if (this.scene.pauseSystem?.isPaused?.()) return;
    if (!this.isPointerInsideDialogueBox(pointer)) return;

    this.advance();
  }

  isPointerInsideDialogueBox(pointer) {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const left = Math.max(32, width * 0.06);
    const right = width - left;
    const top = height - 178;
    const bottom = height - 38;

    return pointer.x >= left && pointer.x <= right && pointer.y >= top && pointer.y <= bottom;
  }

  update() {
    if (!this.isActive) return;
    if (this.scene.pauseSystem?.isPaused?.()) return;

    const wantsAdvance = Phaser.Input.Keyboard.JustDown(this.advanceKeys.space)
      || Phaser.Input.Keyboard.JustDown(this.advanceKeys.enter)
      || Phaser.Input.Keyboard.JustDown(this.advanceKeys.attack);

    if (wantsAdvance) {
      this.advance();
    }
  }

  start(dialogueId, options = {}) {
    const lines = getDialogue(dialogueId);
    if (!lines.length) return false;
    if (this.isActive) return false;
    if (this.scene.pauseSystem?.isPaused?.() && !options.ignorePause) return false;

    if (options.once && this.triggeredDialogues.has(dialogueId)) {
      return false;
    }

    this.triggeredDialogues.add(dialogueId);
    this.currentLines = lines;
    this.currentIndex = 0;
    this.onComplete = options.onComplete ?? null;
    this.activeOptions = options;
    this.isActive = true;
    this.lastAdvanceAt = this.scene.time.now;
    this.refreshLayout();
    this.container.setVisible(true);
    this.scene.inputSystem?.releaseAllTouchInputs?.();
    this.renderCurrentLine();
    return true;
  }

  renderCurrentLine() {
    const line = this.currentLines[this.currentIndex];
    if (!line) {
      this.finish();
      return;
    }

    this.speakerText.setText(line.speaker ?? '');
    this.bodyText.setText(line.text ?? '');
  }

  advance() {
    if (!this.isActive) return;

    const now = this.scene.time.now;
    if (now - this.lastAdvanceAt < 140) return;
    this.lastAdvanceAt = now;

    this.currentIndex += 1;
    if (this.currentIndex >= this.currentLines.length) {
      this.finish();
      return;
    }

    this.renderCurrentLine();
  }

  finish() {
    this.isActive = false;
    this.currentLines = [];
    this.currentIndex = 0;
    this.container.setVisible(false);
    this.scene.inputSystem?.releaseAllTouchInputs?.();
    this.lastFinishedAt = this.scene.time.now;

    const completeCallback = this.onComplete;
    this.onComplete = null;
    this.activeOptions = {};
    completeCallback?.();
  }

  isBlockingPlayer() {
    if (!this.isActive) return false;

    const currentLine = this.currentLines[this.currentIndex];
    return currentLine?.lockPlayer !== false;
  }

  isBlockingGameplay() {
    if (!this.isActive) return false;
    if (this.activeOptions.pauseGameplay) return true;
    return this.isBlockingPlayer();
  }

  canStartNewDialogue(cooldown = 550) {
    if (this.isActive) return false;
    return this.scene.time.now - this.lastFinishedAt >= cooldown;
  }
}
