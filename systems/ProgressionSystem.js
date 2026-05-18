import SaveSystem from './SaveSystem.js';
import { GAME_DATA } from '../data/gameData.js';

export default class ProgressionSystem {
  constructor() {
    this.save = SaveSystem.load();
  }

  getCoins() {
    return this.save.coins;
  }

  addCoins(amount) {
    this.save.coins += amount;
    SaveSystem.save(this.save);
    return this.save.coins;
  }

  completeLevel(levelName, earnedCoins = 0) {
    if (!this.save.completedLevels.includes(levelName)) {
      this.save.completedLevels.push(levelName);
    }

    this.save.coins += earnedCoins;
    SaveSystem.save(this.save);
    return this.save;
  }

  canBuyUpgrade(upgradeName) {
    const cost = GAME_DATA.progression.upgradeCosts[upgradeName];
    return typeof cost === 'number' && this.save.coins >= cost;
  }

  buyUpgrade(upgradeName) {
    const cost = GAME_DATA.progression.upgradeCosts[upgradeName];

    if (!this.canBuyUpgrade(upgradeName)) {
      return false;
    }

    this.save.coins -= cost;
    this.save.upgrades[upgradeName] += 1;
    SaveSystem.save(this.save);
    return true;
  }

  getUpgradeLevel(upgradeName) {
    return this.save.upgrades[upgradeName] ?? 0;
  }
}
