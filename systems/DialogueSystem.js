import { getDialogue } from '../data/dialogues.js';

export default class DialogueSystem {
  constructor(scene) {
    this.scene = scene;
    this.isActive = false;
    this.currentLines = [];
    this.currentIndex = 0;
    this.onComplete = null;
    this.triggeredDialogues = new Set();

    this.createBox();
    this.registerInputs();
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

    // Evita que toques nos botões virtuais disparem falas e ação ao mesmo tempo.
    if (pointer.y < this.scene.scale.height - 170) {
      this.advance();
    }
  }

  update() {
    if (!this.isActive) return;

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

    if (options.once && this.triggeredDialogues.has(dialogueId)) {
      return false;
    }

    this.triggeredDialogues.add(dialogueId);
    this.currentLines = lines;
    this.currentIndex = 0;
    this.onComplete = options.onComplete ?? null;
    this.isActive = true;
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

    const completeCallback = this.onComplete;
    this.onComplete = null;
    completeCallback?.();
  }

  isBlockingPlayer() {
    if (!this.isActive) return false;

    const currentLine = this.currentLines[this.currentIndex];
    return currentLine?.lockPlayer !== false;
  }
}
