export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create(data) {
    this.add.image(480, 270, 'mist-bg-placeholder');

    this.add.text(480, 125, 'Selo restaurado!', {
      fontFamily: 'Arial',
      fontSize: '44px',
      color: '#7be7ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(480, 190, `Fase concluída: ${data.levelName ?? 'Caminho dos Sussurros'}`, {
      fontFamily: 'Arial',
      fontSize: '21px',
      color: '#f2fbff',
    }).setOrigin(0.5);

    this.add.text(480, 225, `Moedas recebidas: ${data.coins ?? 0}`, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffd166',
    }).setOrigin(0.5);

    this.createButton(480, 315, 'Jogar novamente', () => {
      this.scene.start('GameScene');
    });

    this.createButton(480, 380, 'Melhorias', () => {
      this.scene.start('UpgradeScene');
    });

    this.createButton(480, 445, 'Menu principal', () => {
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
