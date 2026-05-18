export const GAME_DATA = {
  title: 'Kage no Kiro',
  player: {
    name: 'Ren Kiro',
    maxHealth: 100,

    // Velocidade máxima horizontal do personagem.
    speed: 260,

    // Aceleração e desaceleração deixam o movimento mais fluido e responsivo.
    acceleration: 1650,
    deceleration: 2100,

    // Pulo principal e pulo duplo. O segundo pulo é um pouco menor para parecer natural.
    jumpForce: 500,
    doubleJumpForce: 455,
    maxJumps: 2,

    // Dash curto, rápido e com cooldown para não ficar apelativo.
    dashSpeed: 620,
    dashDuration: 165,
    dashCooldown: 620,

    maxEnergy: 100,
    energyRegenPerSecond: 10,

    combat: {
      comboResetTime: 520,
      comboCooldown: 170,
      comboSteps: [
        {
          name: 'Corte Rápido',
          damage: 16,
          range: 46,
          width: 54,
          height: 34,
          duration: 105,
          knockback: 150,
          energyGain: 6,
        },
        {
          name: 'Corte Cruzado',
          damage: 22,
          range: 52,
          width: 62,
          height: 38,
          duration: 120,
          knockback: 190,
          energyGain: 8,
        },
        {
          name: 'Corte de Bruma',
          damage: 32,
          range: 60,
          width: 74,
          height: 44,
          duration: 140,
          knockback: 270,
          energyGain: 12,
        },
      ],
      shuriken: {
        name: 'Shuriken de Kiro',
        damage: 14,
        speed: 520,
        cooldown: 360,
        knockback: 110,
        energyCost: 8,
      },
      special: {
        name: 'Orbe do Vento',
        damage: 46,
        speed: 360,
        cooldown: 1200,
        knockback: 360,
        energyCost: 45,
        radius: 34,
      },
    },

    // Mantidos por compatibilidade com sistemas antigos.
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
  special: 0x9fffd0,
  collectible: 0xffd166,
  xp: 0x7be7ff,
  mist: 0x5d3fd3,
};
