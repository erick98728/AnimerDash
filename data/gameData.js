export const GAME_DATA = {
  title: 'Kage no Kiro',
  player: {
    name: 'Ren Kiro',
    maxHealth: 100,
    speed: 230,
    jumpForce: 470,
    dashSpeed: 520,
    attackDamage: 20,
    projectileDamage: 15,
  },
  progression: {
    startingCoins: 0,
    upgradeCosts: {
      maxHealth: 40,
      attackDamage: 50,
      energy: 35,
    },
  },
  level: {
    name: 'Caminho dos Sussurros',
    targetCoins: 8,
    bossHealth: 140,
  },
};

export const COLORS = {
  background: 0x07111f,
  platform: 0x18324a,
  player: 0x7be7ff,
  playerAccent: 0xffffff,
  enemy: 0x8f5cff,
  boss: 0xff5c8a,
  projectile: 0xffd166,
  collectible: 0xffd166,
  mist: 0x5d3fd3,
};
