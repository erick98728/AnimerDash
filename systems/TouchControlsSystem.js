import SaveSystem from './SaveSystem.js';

export default class TouchControlsSystem {
  constructor(scene, inputSystem) {
    this.scene = scene;
    this.inputSystem = inputSystem;
    this.buttons = [];
    this.settings = SaveSystem.getSettings();
    this.isVisible = this.shouldShowTouchControls();

    this.createControls();
    this.updateLayout();
    this.applySettings();

    scene.scale.on('resize', this.updateLayout, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.scale.off('resize', this.updateLayout, this);
      this.destroy();
    });
  }

  shouldShowTouchControls() {
    return (this.scene.sys.game.device.input.touch || window.innerWidth <= 900) && this.settings.showTouchControls;
  }

  createControls() {
    this.pauseButton = this.createActionButton('pause', 'Ⅱ', 914, 52, 32, () => {
      this.scene.pauseSystem?.pauseFromButton?.();
    });

    this.leftButton = this.createHoldButton('left', '◀', 72, 440, 54, () => {
      this.inputSystem.setTouchDirection('left', true);
    }, () => {
      this.inputSystem.setTouchDirection('left', false);
    });

    this.rightButton = this.createHoldButton('right', '▶', 148, 440, 54, () => {
      this.inputSystem.setTouchDirection('right', true);
    }, () => {
      this.inputSystem.setTouchDirection('right', false);
    });

    this.jumpButton = this.createActionButton('jump', 'PULO', 730, 430, 50);
    this.dashButton = this.createActionButton('dash', 'DASH', 805, 478, 45);
    this.attackButton = this.createActionButton('attack', 'ATQ', 855, 400, 48);
    this.projectileButton = this.createActionButton('projectile', 'SHU', 910, 462, 42);
    this.specialButton = this.createActionButton('special', 'ORB', 790, 360, 43);
  }

  createHoldButton(id, label, x, y, radius, onPress, onRelease) {
    const circle = this.scene.add.circle(x, y, radius, 0x18324a, this.settings.touchControlsOpacity)
      .setStrokeStyle(3, 0x7be7ff, 0.65)
      .setScrollFactor(0)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true });

    const text = this.scene.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    circle.on('pointerdown', () => {
      circle.setFillStyle(0x24506f, Math.min(1, this.settings.touchControlsOpacity + 0.18));
      onPress();
    });

    const release = () => {
      circle.setFillStyle(0x18324a, this.settings.touchControlsOpacity);
      onRelease();
    };

    circle.on('pointerup', release);
    circle.on('pointerout', release);
    circle.on('pointerupoutside', release);

    const button = { id, circle, label: text, baseX: x, baseY: y, radius, kind: 'hold' };
    this.buttons.push(button);
    return button;
  }

  createActionButton(action, label, x, y, radius, customCallback = null) {
    const circle = this.scene.add.circle(x, y, radius, 0x32224f, this.settings.touchControlsOpacity)
      .setStrokeStyle(3, 0xffd166, 0.72)
      .setScrollFactor(0)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true });

    const text = this.scene.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: action === 'special' ? '13px' : '14px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    circle.on('pointerdown', () => {
      circle.setFillStyle(0x5d3fd3, Math.min(1, this.settings.touchControlsOpacity + 0.2));
      if (customCallback) {
        customCallback();
      } else {
        this.inputSystem.triggerTouchAction(action);
      }
    });

    const release = () => {
      circle.setFillStyle(0x32224f, this.settings.touchControlsOpacity);
    };

    circle.on('pointerup', release);
    circle.on('pointerout', release);
    circle.on('pointerupoutside', release);

    const button = { id: action, circle, label: text, baseX: x, baseY: y, radius, kind: 'action' };
    this.buttons.push(button);
    return button;
  }

  updateLayout() {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const safeBottom = Math.max(16, height * 0.04);
    const leftBaseY = height - safeBottom - 48;
    const rightActionX = width - 92;

    const positions = {
      pause: { x: width - 48, y: 48 },
      left: { x: 72, y: leftBaseY },
      right: { x: 148, y: leftBaseY },
      jump: { x: rightActionX - 142, y: height - safeBottom - 58 },
      dash: { x: rightActionX - 64, y: height - safeBottom - 20 },
      attack: { x: rightActionX, y: height - safeBottom - 92 },
      projectile: { x: rightActionX + 44, y: height - safeBottom - 28 },
      special: { x: rightActionX - 66, y: height - safeBottom - 130 },
    };

    this.buttons.forEach((button) => {
      const position = positions[button.id];
      if (!position) return;

      button.circle.setPosition(position.x, position.y);
      button.label.setPosition(position.x, position.y);
    });
  }

  applySettings() {
    this.settings = SaveSystem.getSettings();
    this.isVisible = this.shouldShowTouchControls();

    this.buttons.forEach(({ circle, label, kind }) => {
      const fillColor = kind === 'hold' ? 0x18324a : 0x32224f;
      circle.setFillStyle(fillColor, this.settings.touchControlsOpacity);
      circle.setVisible(this.isVisible);
      label.setVisible(this.isVisible);
      label.setAlpha(this.settings.touchControlsOpacity >= 0.45 ? 1 : 0.75);
    });
  }

  destroy() {
    this.buttons.forEach(({ circle, label }) => {
      circle.destroy();
      label.destroy();
    });
    this.buttons = [];
  }
}
