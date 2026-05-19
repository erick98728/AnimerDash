export default class HudSystem {
  constructor(scene, levelSystem) {
    this.scene = scene;
    this.levelSystem = levelSystem;
    this.create();
  }

  create() {
    this.healthText = this.scene.add.text(24, 78, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f2fbff',
    }).setScrollFactor(0);

    this.energyText = this.scene.add.text(24, 104, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#7be7ff',
    }).setScrollFactor(0);

    this.coinText = this.scene.add.text(24, 130, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffd166',
    }).setScrollFactor(0);

    this.helpText = this.scene.add.text(24, 504, 'Teclado: J combo, K dash, L shuriken, I Orbe | Mobile: botões na tela', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#9bb6c8',
    }).setScrollFactor(0);
  }

  update(player, levelCoins, levelXp) {
    const reward = this.levelSystem.getReward();

    this.healthText.setText(`Vida: ${player.health}/${player.maxHealth}`);
    this.energyText.setText(`Energia: ${Math.floor(player.energy)}/${player.maxEnergy}`);
    this.coinText.setText(`Coletado: ${levelCoins} moedas | XP: ${levelXp} | Recompensa: +${reward.coins ?? 0} moedas`);
  }
}
