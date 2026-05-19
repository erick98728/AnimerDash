import Collectible from '../entities/Collectible.js';

export default class DropSystem {
  constructor(scene, collectiblesGroup) {
    this.scene = scene;
    this.collectibles = collectiblesGroup;
  }

  setCollectiblesGroup(collectiblesGroup) {
    this.collectibles = collectiblesGroup;
  }

  dropRewards(enemy) {
    for (let i = 0; i < enemy.dropCoins; i += 1) {
      const coin = new Collectible(
        this.scene,
        enemy.x + Phaser.Math.Between(-22, 22),
        enemy.y + Phaser.Math.Between(-20, 10),
        1,
        'coin',
      );
      this.collectibles.add(coin);
    }

    for (let i = 0; i < enemy.dropXp; i += 1) {
      const xp = new Collectible(
        this.scene,
        enemy.x + Phaser.Math.Between(-18, 18),
        enemy.y + Phaser.Math.Between(-26, 0),
        1,
        'xp',
      );
      this.collectibles.add(xp);
    }
  }
}
