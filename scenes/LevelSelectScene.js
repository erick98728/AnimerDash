import ProgressionSystem from '../systems/ProgressionSystem.js';
import { LEVELS } from '../data/levels.js';

export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create() {
    this.progressionSystem = new ProgressionSystem();
    this.save = this.progressionSystem.getSave();
    this.currentPage = 0;
    this.cardsPerPage = 5;

    this.add.image(480, 270, 'mist-bg-placeholder');

    this.add.text(480, 38, 'Seleção de Fases', {
      fontFamily: 'Arial',
      fontSize: '36px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(480, 72, 'Complete uma fase para liberar a próxima', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#9bb6c8',
    }).setOrigin(0.5);

    this.createNavigationButtons();
    this.renderPage();
  }

  createNavigationButtons() {
    this.backButton = this.createButton(116, 502, 180, 40, 'Voltar ao menu', () => {
      this.scene.start('MenuScene');
    });

    this.previousButton = this.createButton(350, 502, 150, 40, 'Anterior', () => {
      this.currentPage = Math.max(0, this.currentPage - 1);
      this.renderPage();
    });

    this.nextButton = this.createButton(610, 502, 150, 40, 'Próxima', () => {
      const maxPage = Math.ceil(LEVELS.length / this.cardsPerPage) - 1;
      this.currentPage = Math.min(maxPage, this.currentPage + 1);
      this.renderPage();
    });

    this.bossButton = this.createButton(824, 502, 210, 40, 'Arena Kaizen', () => {
      if (!this.isBossUnlocked()) return;
      this.scene.start('GameScene', { levelId: 'boss-prototype' });
    });
  }

  renderPage() {
    this.cards?.forEach((item) => item.destroy());
    this.cards = [];
    this.save = this.progressionSystem.getSave();

    const start = this.currentPage * this.cardsPerPage;
    const visibleLevels = LEVELS.slice(start, start + this.cardsPerPage);

    visibleLevels.forEach((level, index) => {
      const globalIndex = start + index;
      this.createLevelCard(level, globalIndex, 78 + index * 82);
    });

    this.updateNavigationState();
    this.createBossHighlight();
  }

  createLevelCard(level, index, y) {
    const unlocked = this.isLevelUnlocked(index);
    const completed = this.isLevelCompleted(level.id);
    const reward = level.reward ?? { coins: 0, xp: 0 };
    const bgColor = completed ? 0x173323 : unlocked ? 0x18324a : 0x111827;
    const borderColor = completed ? 0x7be7ff : unlocked ? 0xffd166 : 0x4b5563;

    const card = this.add.rectangle(480, y + 36, 860, 74, bgColor, unlocked ? 0.92 : 0.58)
      .setStrokeStyle(2, borderColor, unlocked ? 0.9 : 0.55);

    const title = this.add.text(72, y + 13, `${index + 1}. ${level.name}`, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: unlocked ? '#f2fbff' : '#6b7280',
      fontStyle: 'bold',
    });

    const status = completed ? 'Concluída' : unlocked ? 'Liberada' : 'Bloqueada';
    const statusText = this.add.text(72, y + 38, `Status: ${status} | Dificuldade: ${level.difficulty}/10`, {
      fontFamily: 'Arial',
      fontSize: '13px',
      color: completed ? '#7be7ff' : unlocked ? '#ffd166' : '#6b7280',
    });

    const themeText = this.add.text(360, y + 14, `Tema: ${level.visualTheme}`, {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: unlocked ? '#9bb6c8' : '#6b7280',
      wordWrap: { width: 330 },
    });

    const rewardText = this.add.text(360, y + 44, `Recompensa: ${reward.coins ?? 0} moedas, ${reward.xp ?? 0} XP`, {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: unlocked ? '#dffaff' : '#6b7280',
    });

    const playButton = this.createButton(794, y + 36, 150, 40, unlocked ? 'Jogar' : 'Bloqueada', () => {
      if (!unlocked) return;
      this.scene.start('GameScene', { levelId: level.id });
    }, !unlocked);

    this.cards.push(card, title, statusText, themeText, rewardText, playButton.button, playButton.text);
  }

  createBossHighlight() {
    if (this.bossCardItems) {
      this.bossCardItems.forEach((item) => item.destroy());
    }

    this.bossCardItems = [];
    const unlocked = this.isBossUnlocked();
    const bg = this.add.rectangle(480, 462, 860, 34, unlocked ? 0x32224f : 0x111827, unlocked ? 0.9 : 0.55)
      .setStrokeStyle(2, unlocked ? 0xff5c8a : 0x4b5563, 0.8);

    const text = this.add.text(480, 462, unlocked
      ? 'Chefe destacado: Kaizen liberado após concluir a fase 10'
      : 'Chefe destacado: Kaizen bloqueado, conclua a fase 10', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: unlocked ? '#f2fbff' : '#9bb6c8',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.bossCardItems.push(bg, text);
  }

  updateNavigationState() {
    const maxPage = Math.ceil(LEVELS.length / this.cardsPerPage) - 1;
    this.setButtonEnabled(this.previousButton, this.currentPage > 0);
    this.setButtonEnabled(this.nextButton, this.currentPage < maxPage);
    this.setButtonEnabled(this.bossButton, this.isBossUnlocked());
  }

  isLevelCompleted(levelId) {
    return this.save.completedLevels.includes(levelId);
  }

  isLevelUnlocked(index) {
    if (index === 0) return true;

    const previousLevel = LEVELS[index - 1];
    return this.isLevelCompleted(previousLevel.id);
  }

  isBossUnlocked() {
    const lastLevel = LEVELS[LEVELS.length - 1];
    return this.isLevelCompleted(lastLevel.id) || this.isLevelCompleted('boss-prototype');
  }

  createButton(x, y, width, height, label, callback, disabled = false) {
    const button = this.add.rectangle(x, y, width, height, disabled ? 0x1f2937 : 0x18324a, disabled ? 0.55 : 0.95)
      .setStrokeStyle(2, disabled ? 0x4b5563 : 0x7be7ff, disabled ? 0.55 : 1)
      .setInteractive({ useHandCursor: !disabled });

    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: disabled ? '#6b7280' : '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.isDisabled = disabled;

    button.on('pointerover', () => {
      if (!button.isDisabled) button.setFillStyle(0x24506f, 0.95);
    });

    button.on('pointerout', () => {
      if (!button.isDisabled) button.setFillStyle(0x18324a, 0.95);
    });

    button.on('pointerdown', () => {
      if (!button.isDisabled) callback();
    });

    return { button, text };
  }

  setButtonEnabled(buttonGroup, enabled) {
    const { button, text } = buttonGroup;
    button.isDisabled = !enabled;
    button.setFillStyle(enabled ? 0x18324a : 0x1f2937, enabled ? 0.95 : 0.55);
    button.setStrokeStyle(2, enabled ? 0x7be7ff : 0x4b5563, enabled ? 1 : 0.55);
    text.setColor(enabled ? '#f2fbff' : '#6b7280');
  }
}
