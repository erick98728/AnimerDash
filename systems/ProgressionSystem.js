import SaveSystem from './SaveSystem.js';
import {
  LEVEL_BALANCE,
  UPGRADE_DEFINITIONS,
  getLevelFromXp,
  getNextLevelXp,
  getUpgradeCost,
} from '../data/balance.js';

export default class ProgressionSystem {
  constructor() {
    this.save = SaveSystem.load();
    this.refreshLevelFromXp();
  }

  getSave() {
    return this.save;
  }

  persist() {
    this.save = SaveSystem.save(this.save);
    return this.save;
  }

  refreshLevelFromXp() {
    const previousLevel = this.save.playerLevel ?? 1;
    const nextLevel = getLevelFromXp(this.save.xp ?? 0);

    if (nextLevel > previousLevel) {
      const gainedLevels = nextLevel - previousLevel;
      this.save.skillPoints += gainedLevels;
      this.save.totalSkillPointsEarned += gainedLevels;
    }

    this.save.playerLevel = nextLevel;
    this.persist();
    return nextLevel;
  }

  getCoins() {
    return this.save.coins;
  }

  getXp() {
    return this.save.xp;
  }

  getLevel() {
    return this.save.playerLevel;
  }

  getRareScrolls() {
    return this.save.rareScrolls;
  }

  getSkillPoints() {
    return this.save.skillPoints;
  }

  getNextLevelXp() {
    return getNextLevelXp(this.save.playerLevel);
  }

  addCoins(amount) {
    this.save.coins += Math.max(0, amount);
    this.persist();
    return this.save.coins;
  }

  addXp(amount) {
    this.save.xp += Math.max(0, amount);
    this.refreshLevelFromXp();
    return this.save.xp;
  }

  addRareScrolls(amount) {
    this.save.rareScrolls += Math.max(0, amount);
    this.persist();
    return this.save.rareScrolls;
  }

  completeLevel(levelName, earnedCoins = 0, earnedXp = 0, options = {}) {
    if (!this.save.completedLevels.includes(levelName)) {
      this.save.completedLevels.push(levelName);
    }

    this.save.coins += Math.max(0, earnedCoins);
    this.save.xp += Math.max(0, earnedXp);

    if (options.rareScrolls) {
      this.save.rareScrolls += Math.max(0, options.rareScrolls);
    }

    if (options.unlockedSkill && !this.save.unlockedSkills.includes(options.unlockedSkill)) {
      this.save.unlockedSkills.push(options.unlockedSkill);
    }

    if (options.specialItem && !this.save.specialItems.includes(options.specialItem)) {
      this.save.specialItems.push(options.specialItem);
    }

    this.persist();
    this.refreshLevelFromXp();
    return this.save;
  }

  getUpgradeDefinition(upgradeName) {
    return UPGRADE_DEFINITIONS[upgradeName];
  }

  getUpgradeLevel(upgradeName) {
    return this.save.upgrades[upgradeName] ?? 0;
  }

  getUpgradeCost(upgradeName) {
    return getUpgradeCost(upgradeName, this.getUpgradeLevel(upgradeName), this.save.playerLevel);
  }

  canBuyUpgrade(upgradeName) {
    const definition = this.getUpgradeDefinition(upgradeName);
    const currentLevel = this.getUpgradeLevel(upgradeName);
    const cost = this.getUpgradeCost(upgradeName);

    if (!definition || !cost) return false;
    if (currentLevel >= definition.maxLevel) return false;

    return (
      this.save.coins >= cost.coins
      && this.save.skillPoints >= cost.skillPoints
      && this.save.rareScrolls >= cost.rareScrolls
    );
  }

  buyUpgrade(upgradeName) {
    const definition = this.getUpgradeDefinition(upgradeName);
    const cost = this.getUpgradeCost(upgradeName);

    if (!definition || !cost || !this.canBuyUpgrade(upgradeName)) {
      return false;
    }

    this.save.coins -= cost.coins;
    this.save.skillPoints -= cost.skillPoints;
    this.save.rareScrolls -= cost.rareScrolls;
    this.save.upgrades[upgradeName] += 1;
    this.persist();
    return true;
  }

  getDerivedStats() {
    const upgrades = this.save.upgrades;

    return {
      maxHealth: 100 + upgrades.maxHealth * UPGRADE_DEFINITIONS.maxHealth.effectPerLevel,
      attackBonus: upgrades.attackDamage * UPGRADE_DEFINITIONS.attackDamage.effectPerLevel,
      maxEnergy: 100 + upgrades.energy * UPGRADE_DEFINITIONS.energy.effectPerLevel,
      dashCooldownReduction: upgrades.dash * UPGRADE_DEFINITIONS.dash.effectPerLevel,
      shurikenDamageBonus: upgrades.shuriken * UPGRADE_DEFINITIONS.shuriken.effectPerLevel,
      shurikenCooldownReduction: upgrades.shuriken * 20,
    };
  }

  getBalanceTable() {
    return LEVEL_BALANCE;
  }
}
