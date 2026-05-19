import { GAME_DATA } from '../data/gameData.js';

export default class BossHudSystem {
  constructor(scene, levelSystem) {
    this.scene = scene;
    this.levelSystem = levelSystem;
    this.isEnabled = levelSystem.requiresBossDefeat();

    if (this.isEnabled) {
      this.create();
    }
  }

  create() {
    this.bossNameText = this.scene.add.text(480, 18, GAME_DATA.boss.name, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0);

    this.bossBarBack = this.scene.add.rectangle(480, 44, 560, 18, 0x200814, 0.95)
      .setStrokeStyle(2, 0xb9a7ff)
      .setScrollFactor(0);

    this.bossBarFill = this.scene.add.rectangle(200, 44, 560, 14, 0xff5c8a, 0.95)
      .setOrigin(0, 0.5)
      .setScrollFactor(0);

    this.bossPhaseText = this.scene.add.text(480, 66, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#b9a7ff',
    }).setOrigin(0.5).setScrollFactor(0);
  }

  update(boss) {
    if (!this.isEnabled) return;

    if (!boss || !boss.active) {
      this.bossBarFill.width = 0;
      this.bossPhaseText.setText('Kaizen derrotado');
      return;
    }

    const healthRatio = Phaser.Math.Clamp(boss.health / boss.maxHealth, 0, 1);
    this.bossBarFill.width = 560 * healthRatio;
    this.bossPhaseText.setText(`Fase ${boss.phase}/3`);
  }
}
