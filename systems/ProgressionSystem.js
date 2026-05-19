import SaveSystem from './SaveSystem.js';
import {
  COMBAT_BALANCE,
  LEVEL_BALANCE,
  UPGRADE_DEFINITIONS,
  clamp,
  getLevelFromXp,
  getNextLevelXp,
  getUpgradeCost,
} from '../data/balance.js';

export default class ProgressionSystem {
  constructor() {
    this.save = SaveSystem.load();
    this.refreshLevelFromXp();
  }

  static applyLevelFromXp(save) {
    const previousLevel = save.playerLevel ?? 1;
    const nextLevel = getLevelFromXp(save.xp ?? 0);

    if (nextLevel > previousLevel) {
      const gainedLevels = nextLevel - previousLevel;
      save.skillPoints += gainedLevels;
      save.totalSkillPointsEarned += gainedLevels;
    }

    save.playerLevel = nextLevel;
    return save;
  }

  static addRewardToSave(save, reward = {}) {
    save.coins += Math.max(0, reward.coins ?? 0);
    save.xp += Math.max(0, reward.xp ?? 0);
    save.rareScrolls += Math.max(0, reward.rareScrolls ?? 0);
    return ProgressionSystem.applyLevelFromXp(save);
  }

  reload() {
    this.save = SaveSystem.load();
    return this.save;
  }

  getSave() {
    return this.reload();
  }

  persist() {
    this.save = SaveSystem.save(this.save);
    return this.save;
  }

  updateSave(updater) {
    this.save = SaveSystem.update((save) => {
      updater(save);
      return ProgressionSystem.applyLevelFromXp(save);
    });

    return this.save;
  }

  refreshLevelFromXp() {
    this.save = SaveSystem.update((save) => ProgressionSystem.applyLevelFromXp(save));
    return this.save.playerLevel;
  }

  getCoins() {
    return this.reload().coins;
  }

  getXp() {
    return this.reload().xp;
  }

  getLevel() {
    return this.reload().playerLevel;
  }

  getRareScrolls() {
    return this.reload().rareScrolls;
  }

  getSkillPoints() {
    return this.reload().skillPoints;
  }

  getNextLevelXp() {
    return getNextLevelXp(this.reload().playerLevel);
  }

  addCoins(amount) {
    this.updateSave((save) => {
      save.coins += Math.max(0, amount);
    });
    return this.save.coins;
  }

  addXp(amount) {
    this.updateSave((save) => {
      save.xp += Math.max(0, amount);
    });
    return this.save.xp;
  }

  addRareScrolls(amount) {
    this.updateSave((save) => {
      save.rareScrolls += Math.max(0, amount);
    });
    return this.save.rareScrolls;
  }

  completeLevel(levelName, earnedCoins = 0, earnedXp = 0, options = {}) {
    this.updateSave((save) => {
      if (!save.completedLevels.includes(levelName)) {
        save.completedLevels.push(levelName);
      }

      save.coins += Math.max(0, earnedCoins);
      save.xp += Math.max(0, earnedXp);

      if (options.rareScrolls) {
        save.rareScrolls += Math.max(0, options.rareScrolls);
      }

      if (options.unlockedSkill && !save.unlockedSkills.includes(options.unlockedSkill)) {
        save.unlockedSkills.push(options.unlockedSkill);
      }

      if (options.specialItem && !save.specialItems.includes(options.specialItem)) {
        save.specialItems.push(options.specialItem);
      }
    });

    return this.save;
  }

  getUpgradeDefinition(upgradeName) {
    return UPGRADE_DEFINITIONS[upgradeName];
  }

  getUpgradeLevel(upgradeName) {
    return this.reload().upgrades[upgradeName] ?? 0;
  }

  getUpgradeCost(upgradeName) {
    const save = this.reload();
    return getUpgradeCost(upgradeName, save.upgrades[upgradeName] ?? 0, save.playerLevel);
  }

  canBuyUpgrade(upgradeName) {
    const save = this.reload();
    const definition = this.getUpgradeDefinition(upgradeName);
    const currentLevel = save.upgrades[upgradeName] ?? 0;
    const cost = getUpgradeCost(upgradeName, currentLevel, save.playerLevel);

    if (!definition || !cost) return false;
    if (currentLevel >= definition.maxLevel) return false;

    return (
      save.coins >= cost.coins
      && save.skillPoints >= cost.skillPoints
      && save.rareScrolls >= cost.rareScrolls
    );
  }

  buyUpgrade(upgradeName) {
    let purchased = false;

    this.updateSave((save) => {
      const definition = this.getUpgradeDefinition(upgradeName);
      const currentLevel = save.upgrades[upgradeName] ?? 0;
      const cost = getUpgradeCost(upgradeName, currentLevel, save.playerLevel);

      if (!definition || !cost) return;
      if (currentLevel >= definition.maxLevel) return;
      if (
        save.coins < cost.coins
        || save.skillPoints < cost.skillPoints
        || save.rareScrolls < cost.rareScrolls
      ) return;

      save.coins -= cost.coins;
      save.skillPoints -= cost.skillPoints;
      save.rareScrolls -= cost.rareScrolls;
      save.upgrades[upgradeName] = currentLevel + 1;
      purchased = true;
    });

    return purchased;
  }

  getDerivedStats() {
    const upgrades = this.reload().upgrades;
    const attackBonus = upgrades.attackDamage * UPGRADE_DEFINITIONS.attackDamage.effectPerLevel;
    const shurikenRawBonus = upgrades.shuriken * COMBAT_BALANCE.shuriken.upgradeDamagePerLevel;
    const shurikenDamageBonus = clamp(shurikenRawBonus, 0, COMBAT_BALANCE.shuriken.maxUpgradeDamageBonus);
    const specialRawBonus = Math.floor(
      attackBonus * COMBAT_BALANCE.special.attackUpgradeScaling
      + shurikenDamageBonus * COMBAT_BALANCE.special.shurikenUpgradeScaling,
    );

    return {
      maxHealth: 100 + upgrades.maxHealth * UPGRADE_DEFINITIONS.maxHealth.effectPerLevel,
      attackBonus: clamp(attackBonus, 0, COMBAT_BALANCE.combo.maxAttackBonusPerHit),
      maxEnergy: 100 + upgrades.energy * UPGRADE_DEFINITIONS.energy.effectPerLevel,
      dashCooldownReduction: upgrades.dash * UPGRADE_DEFINITIONS.dash.effectPerLevel,
      shurikenDamageBonus,
      shurikenCooldownReduction: upgrades.shuriken * COMBAT_BALANCE.shuriken.cooldownReductionPerLevel,
      shurikenMinimumCooldown: COMBAT_BALANCE.shuriken.minimumCooldown,
      specialDamageBonus: clamp(specialRawBonus, 0, COMBAT_BALANCE.special.maxUpgradeDamageBonus),
    };
  }

  getBalanceTable() {
    return LEVEL_BALANCE;
  }
}
