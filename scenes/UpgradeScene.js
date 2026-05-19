import ProgressionSystem from '../systems/ProgressionSystem.js';
import { LEVEL_BALANCE, UPGRADE_DEFINITIONS } from '../data/balance.js';

export default class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('UpgradeScene');
  }

  create() {
    this.progressionSystem = new ProgressionSystem();
    this.add.image(480, 270, 'mist-bg-placeholder');

    this.add.text(480, 34, 'Melhorias de Ren Kiro', {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.statusText = this.add.text(30, 70, '', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#f2fbff',
      lineSpacing: 6,
    });

    this.feedbackText = this.add.text(480, 505, '', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#ffd166',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.upgradeRows = [];
    this.createUpgradeRows();
    this.createBalanceTable();

    this.createButton(115, 500, 170, 'Voltar ao menu', () => {
      this.scene.start('MenuScene');
    });

    this.createButton(305, 500, 170, 'Jogar fase', () => {
      this.scene.start('GameScene');
    });

    this.refreshText();
  }

  createUpgradeRows() {
    const upgradeNames = Object.keys(UPGRADE_DEFINITIONS);
    const startY = 165;

    upgradeNames.forEach((upgradeName, index) => {
      const y = startY + index * 62;
      const definition = UPGRADE_DEFINITIONS[upgradeName];

      const title = this.add.text(30, y, '', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#f2fbff',
        fontStyle: 'bold',
      });

      const description = this.add.text(30, y + 20, definition.description, {
        fontFamily: 'Arial',
        fontSize: '13px',
        color: '#9bb6c8',
      });

      const costText = this.add.text(30, y + 38, '', {
        fontFamily: 'Arial',
        fontSize: '13px',
        color: '#ffd166',
      });

      const button = this.createButton(360, y + 22, 130, 'Comprar', () => {
        const bought = this.progressionSystem.buyUpgrade(upgradeName);
        this.feedbackText.setText(bought ? 'Upgrade comprado com sucesso.' : 'Recursos insuficientes ou nível máximo atingido.');
        this.refreshText();
      });

      this.upgradeRows.push({ upgradeName, title, description, costText, button });
    });
  }

  createBalanceTable() {
    this.add.rectangle(710, 282, 450, 390, 0x07111f, 0.72)
      .setStrokeStyle(1, 0x7be7ff, 0.35);

    this.add.text(710, 98, 'Balanceamento 1-20', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#7be7ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(505, 128, 'Nv | XP | Moedas | Custo | Vida | Dano', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#ffd166',
    });

    const compactRows = LEVEL_BALANCE.map((row) => {
      return `${String(row.level).padStart(2, '0')} | ${String(row.xpRequired).padStart(4, ' ')} | ${String(row.averageCoinsPerLevel).padStart(3, ' ')} | ${String(row.baseUpgradeCost).padStart(3, ' ')} | ${String(row.recommendedHealth).padStart(3, ' ')} | ${String(row.recommendedDamage).padStart(2, ' ')}`;
    }).join('\n');

    this.add.text(505, 150, compactRows, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#f2fbff',
      lineSpacing: 2,
    });
  }

  createButton(x, y, width, label, callback) {
    const button = this.add.rectangle(x, y, width, 38, 0x18324a, 0.95)
      .setStrokeStyle(2, 0x7be7ff)
      .setInteractive({ useHandCursor: true });

    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.on('pointerover', () => button.setFillStyle(0x24506f));
    button.on('pointerout', () => button.setFillStyle(0x18324a));
    button.on('pointerdown', callback);

    return { button, text };
  }

  refreshText() {
    const save = this.progressionSystem.getSave();
    const nextLevelXp = this.progressionSystem.getNextLevelXp();
    const nextLevelText = nextLevelXp ? `${save.xp}/${nextLevelXp}` : `${save.xp}/MAX`;

    this.statusText.setText([
      `Nível: ${save.playerLevel}    XP: ${nextLevelText}`,
      `Moedas: ${save.coins}    Pergaminhos raros: ${save.rareScrolls}    Pontos de habilidade: ${save.skillPoints}`,
      `Habilidades desbloqueadas: ${save.unlockedSkills.length ? save.unlockedSkills.join(', ') : 'nenhuma ainda'}`,
    ]);

    this.upgradeRows.forEach((row) => {
      const definition = UPGRADE_DEFINITIONS[row.upgradeName];
      const level = this.progressionSystem.getUpgradeLevel(row.upgradeName);
      const cost = this.progressionSystem.getUpgradeCost(row.upgradeName);
      const isMaxed = level >= definition.maxLevel;

      row.title.setText(`${definition.label}  Nv. ${level}/${definition.maxLevel}`);
      row.costText.setText(isMaxed ? 'Nível máximo alcançado' : `Custo: ${cost.coins} moedas, ${cost.skillPoints} ponto, ${cost.rareScrolls} pergaminho raro`);
      row.button.text.setText(isMaxed ? 'Máximo' : 'Comprar');
      row.button.button.setAlpha(this.progressionSystem.canBuyUpgrade(row.upgradeName) ? 1 : 0.55);
    });
  }
}
