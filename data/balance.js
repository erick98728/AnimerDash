// Tabela de balanceamento do nível 1 ao 20.
// A ideia é controlar a evolução para o jogo não ficar fácil demais nem frustrante.

export const LEVEL_BALANCE = [
  { level: 1, xpRequired: 0, averageCoinsPerLevel: 10, baseUpgradeCost: 25, recommendedHealth: 100, recommendedDamage: 16 },
  { level: 2, xpRequired: 35, averageCoinsPerLevel: 12, baseUpgradeCost: 35, recommendedHealth: 108, recommendedDamage: 18 },
  { level: 3, xpRequired: 85, averageCoinsPerLevel: 14, baseUpgradeCost: 45, recommendedHealth: 116, recommendedDamage: 20 },
  { level: 4, xpRequired: 150, averageCoinsPerLevel: 16, baseUpgradeCost: 58, recommendedHealth: 124, recommendedDamage: 22 },
  { level: 5, xpRequired: 235, averageCoinsPerLevel: 18, baseUpgradeCost: 72, recommendedHealth: 132, recommendedDamage: 24 },
  { level: 6, xpRequired: 340, averageCoinsPerLevel: 21, baseUpgradeCost: 88, recommendedHealth: 142, recommendedDamage: 26 },
  { level: 7, xpRequired: 465, averageCoinsPerLevel: 24, baseUpgradeCost: 106, recommendedHealth: 152, recommendedDamage: 28 },
  { level: 8, xpRequired: 615, averageCoinsPerLevel: 27, baseUpgradeCost: 126, recommendedHealth: 162, recommendedDamage: 30 },
  { level: 9, xpRequired: 790, averageCoinsPerLevel: 30, baseUpgradeCost: 148, recommendedHealth: 172, recommendedDamage: 32 },
  { level: 10, xpRequired: 990, averageCoinsPerLevel: 34, baseUpgradeCost: 172, recommendedHealth: 184, recommendedDamage: 35 },
  { level: 11, xpRequired: 1220, averageCoinsPerLevel: 38, baseUpgradeCost: 198, recommendedHealth: 196, recommendedDamage: 38 },
  { level: 12, xpRequired: 1485, averageCoinsPerLevel: 42, baseUpgradeCost: 226, recommendedHealth: 208, recommendedDamage: 41 },
  { level: 13, xpRequired: 1785, averageCoinsPerLevel: 46, baseUpgradeCost: 256, recommendedHealth: 220, recommendedDamage: 44 },
  { level: 14, xpRequired: 2125, averageCoinsPerLevel: 50, baseUpgradeCost: 288, recommendedHealth: 234, recommendedDamage: 47 },
  { level: 15, xpRequired: 2505, averageCoinsPerLevel: 55, baseUpgradeCost: 322, recommendedHealth: 248, recommendedDamage: 50 },
  { level: 16, xpRequired: 2930, averageCoinsPerLevel: 60, baseUpgradeCost: 358, recommendedHealth: 262, recommendedDamage: 54 },
  { level: 17, xpRequired: 3405, averageCoinsPerLevel: 65, baseUpgradeCost: 396, recommendedHealth: 276, recommendedDamage: 58 },
  { level: 18, xpRequired: 3935, averageCoinsPerLevel: 70, baseUpgradeCost: 436, recommendedHealth: 292, recommendedDamage: 62 },
  { level: 19, xpRequired: 4525, averageCoinsPerLevel: 76, baseUpgradeCost: 478, recommendedHealth: 308, recommendedDamage: 66 },
  { level: 20, xpRequired: 5180, averageCoinsPerLevel: 82, baseUpgradeCost: 525, recommendedHealth: 325, recommendedDamage: 70 },
];

// Valores centrais de combate. Ajuste aqui para balancear o jogo sem procurar números espalhados.
export const COMBAT_BALANCE = {
  combo: {
    attackUpgradeScaling: 1,
    maxAttackBonusPerHit: 28,
  },
  shuriken: {
    upgradeDamagePerLevel: 3,
    maxUpgradeDamageBonus: 24,
    cooldownReductionPerLevel: 20,
    minimumCooldown: 180,
  },
  special: {
    attackUpgradeScaling: 0.35,
    shurikenUpgradeScaling: 0.2,
    maxUpgradeDamageBonus: 20,
  },
};

export const UPGRADE_DEFINITIONS = {
  maxHealth: {
    label: 'Vida máxima',
    description: '+10 de vida máxima por nível',
    maxLevel: 10,
    coinCostMultiplier: 1,
    skillPointCost: 1,
    rareScrollCostEvery: 4,
    effectPerLevel: 10,
  },
  attackDamage: {
    label: 'Dano da lâmina',
    description: '+2 de dano nos golpes principais por nível',
    maxLevel: 10,
    coinCostMultiplier: 1.12,
    skillPointCost: 1,
    rareScrollCostEvery: 4,
    effectPerLevel: 2,
  },
  energy: {
    label: 'Energia espiritual',
    description: '+8 de energia máxima por nível',
    maxLevel: 8,
    coinCostMultiplier: 0.95,
    skillPointCost: 1,
    rareScrollCostEvery: 3,
    effectPerLevel: 8,
  },
  dash: {
    label: 'Dash',
    description: 'reduz o cooldown do dash em 35ms por nível',
    maxLevel: 6,
    coinCostMultiplier: 1.08,
    skillPointCost: 1,
    rareScrollCostEvery: 3,
    effectPerLevel: 35,
  },
  shuriken: {
    label: 'Shuriken',
    description: '+3 de dano e -20ms de cooldown por nível',
    maxLevel: 8,
    coinCostMultiplier: 1.05,
    skillPointCost: 1,
    rareScrollCostEvery: 3,
    effectPerLevel: 3,
  },
};

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getBalanceForLevel(level) {
  const safeLevel = clamp(level, 1, 20);
  return LEVEL_BALANCE.find((entry) => entry.level === safeLevel) ?? LEVEL_BALANCE[0];
}

export function getLevelFromXp(totalXp) {
  let currentLevel = 1;

  for (const entry of LEVEL_BALANCE) {
    if (totalXp >= entry.xpRequired) {
      currentLevel = entry.level;
    }
  }

  return currentLevel;
}

export function getNextLevelXp(level) {
  const next = LEVEL_BALANCE.find((entry) => entry.level === level + 1);
  return next?.xpRequired ?? null;
}

export function getUpgradeCost(upgradeName, currentUpgradeLevel, playerLevel) {
  const definition = UPGRADE_DEFINITIONS[upgradeName];
  const levelBalance = getBalanceForLevel(playerLevel);

  if (!definition) {
    return null;
  }

  const nextLevel = currentUpgradeLevel + 1;
  const coinCost = Math.round(levelBalance.baseUpgradeCost * definition.coinCostMultiplier * (1 + currentUpgradeLevel * 0.42));
  const rareScrollCost = definition.rareScrollCostEvery > 0 && nextLevel % definition.rareScrollCostEvery === 0 ? 1 : 0;

  return {
    coins: coinCost,
    skillPoints: definition.skillPointCost,
    rareScrolls: rareScrollCost,
  };
}
