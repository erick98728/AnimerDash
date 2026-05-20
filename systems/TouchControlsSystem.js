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
    return (this.scene.sys.game.device.input.touch || window.innerWidth <= 940) && this.settings.showTouchControls;
  }

  getResponsiveScale() {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const aspect = width / height;

    if (height <= 220) return 0.52;
    if (height <= 320) return 0.62;
    if (aspect >= 2.15) return 0.72;
    if (aspect >= 1.95) return 0.8;
    if (aspect >= 1.72) return 0.86;
    return 0.8;
  }

  getSafeInsets() {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const isMobile = this.scene.sys.game.device.input.touch || window.innerWidth <= 940;

    return {
      left: isMobile ? Math.max(16, width * 0.022) : 16,
      right: isMobile ? Math.max(16, width * 0.022) : 16,
      top: isMobile ? Math.max(14, height * 0.035) : 16,
      bottom: isMobile ? Math.max(14, height * 0.035) : 16,
    };
  }

  clampButtonPosition(x, y, radius, safe, margin = 6) {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    return {
      x: Phaser.Math.Clamp(x, safe.left + radius + margin, width - safe.right - radius - margin),
      y: Phaser.Math.Clamp(y, safe.top + radius + margin, height - safe.bottom - radius - margin),
    };
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
    const scale = this.getResponsiveScale();
    const safe = this.getSafeInsets();
    const playerScreenX = this.scene.player
      ? this.scene.player.x - this.scene.cameras.main.scrollX
      : width * 0.3;
    const leftClusterX = playerScreenX < width * 0.36 ? safe.left + 56 * scale : safe.left + 76 * scale;
    const leftBaseY = height - safe.bottom - 54 * scale;
    const rightActionX = width - safe.right - 86 * scale;

    const positions = {
      pause: { x: width - safe.right - 34 * scale, y: safe.top + 30 * scale, radius: 30 * scale, fontSize: 15 * scale },
      left: { x: leftClusterX, y: leftBaseY, radius: 48 * scale, fontSize: 23 * scale },
      right: { x: leftClusterX + 72 * scale, y: leftBaseY, radius: 48 * scale, fontSize: 23 * scale },
      jump: { x: rightActionX - 130 * scale, y: height - safe.bottom - 74 * scale, radius: 44 * scale, fontSize: 12 * scale },
      dash: { x: rightActionX - 58 * scale, y: height - safe.bottom - 34 * scale, radius: 40 * scale, fontSize: 12 * scale },
      attack: { x: rightActionX, y: height - safe.bottom - 106 * scale, radius: 43 * scale, fontSize: 12 * scale },
      projectile: { x: rightActionX + 42 * scale, y: height - safe.bottom - 44 * scale, radius: 37 * scale, fontSize: 11 * scale },
      special: { x: rightActionX - 62 * scale, y: height - safe.bottom - 140 * scale, radius: 38 * scale, fontSize: 11 * scale },
    };

    this.buttons.forEach((button) => {
      const position = positions[button.id];
      if (!position) return;

      const clamped = this.clampButtonPosition(position.x, position.y, position.radius, safe, 8);
      button.circle.setPosition(clamped.x, clamped.y);
      button.circle.setRadius(position.radius);
      button.label.setPosition(clamped.x, clamped.y);
      button.label.setFontSize(Math.max(10, Math.round(position.fontSize)));
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

      if (this.isVisible) {
        circle.setInteractive({ useHandCursor: true });
      } else {
        circle.disableInteractive();
        this.inputSystem.releaseAllTouchInputs?.();
      }
    });

    this.updateLayout();
  }

  destroy() {
    this.buttons.forEach(({ circle, label }) => {
      circle.destroy();
      label.destroy();
    });
    this.buttons = [];
  }
}
