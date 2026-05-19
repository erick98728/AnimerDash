export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create(data) {
    this.add.image(480, 270, 'mist-bg-placeholder');

    const title = data.defeatedBoss ? 'Chefe derrotado!' : 'Selo restaurado!';

    this.add.text(480, 96, title, {
      fontFamily: 'Arial',
      fontSize: '44px',
      color: '#7be7ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(480, 154, `Fase concluída: ${data.levelName ?? 'Caminho dos Sussurros'}`, {
      fontFamily: 'Arial',
      fontSize: '21px',
      color: '#f2fbff',
    }).setOrigin(0.5);

    if (data.defeatedBoss) {
      this.add.text(480, 190, `${data.defeatedBoss} caiu diante de Ren Kiro`, {
        fontFamily: 'Arial',
        fontSize: '19px',
        color: '#b9a7ff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    this.add.text(480, 226, `Moedas recebidas: ${data.coins ?? 0} | XP: ${data.xp ?? 0}`, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffd166',
    }).setOrigin(0.5);

    if (data.specialItem) {
      this.add.text(480, 264, `Recompensa especial: ${data.specialItem}`, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#f2fbff',
      }).setOrigin(0.5);
    }

    if (data.unlockedSkill) {
      this.add.text(480, 294, `Nova habilidade desbloqueada: ${data.unlockedSkill}`, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#9fffd0',
        fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    this.createButton(480, 360, 'Jogar novamente', () => {
      this.scene.start('GameScene');
    });

    this.createButton(480, 420, 'Melhorias', () => {
      this.scene.start('UpgradeScene');
    });

    this.createButton(480, 480, 'Menu principal', () => {
      this.scene.start('MenuScene');
    });
  }

  createButton(x, y, label, callback) {
    const button = this.add.rectangle(x, y, 280, 48, 0x18324a, 0.95)
      .setStrokeStyle(2, 0x7be7ff)
      .setInteractive({ useHandCursor: true });

    this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '19px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.on('pointerover', () => button.setFillStyle(0x24506f));
    button.on('pointerout', () => button.setFillStyle(0x18324a));
    button.on('pointerdown', callback);
  }
}
