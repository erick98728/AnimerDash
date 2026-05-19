export const DAILY_LOGIN_REWARDS = [
  { day: 1, coins: 20, xp: 10, rareScrolls: 0 },
  { day: 2, coins: 25, xp: 15, rareScrolls: 0 },
  { day: 3, coins: 35, xp: 20, rareScrolls: 0 },
  { day: 4, coins: 45, xp: 25, rareScrolls: 0 },
  { day: 5, coins: 60, xp: 35, rareScrolls: 0 },
  { day: 6, coins: 75, xp: 45, rareScrolls: 0 },
  { day: 7, coins: 110, xp: 70, rareScrolls: 1 },
];

export const DAILY_CHEST_REWARD = {
  coins: 35,
  xp: 25,
  rareScrolls: 0,
};

export const THREE_LEVELS_BONUS = {
  coins: 70,
  xp: 45,
  rareScrolls: 1,
};

export const DAILY_MISSIONS = [
  {
    id: 'defeat-enemies',
    title: 'Limpeza da Névoa',
    description: 'Derrote 8 inimigos.',
    stat: 'enemiesDefeated',
    target: 8,
    reward: { coins: 30, xp: 20, rareScrolls: 0 },
  },
  {
    id: 'collect-coins',
    title: 'Caçador de Moedas Espirituais',
    description: 'Colete 15 moedas.',
    stat: 'coinsCollected',
    target: 15,
    reward: { coins: 25, xp: 15, rareScrolls: 0 },
  },
  {
    id: 'no-death-level',
    title: 'Passos Impecáveis',
    description: 'Complete 1 fase sem morrer.',
    stat: 'noDeathCompletions',
    target: 1,
    reward: { coins: 45, xp: 30, rareScrolls: 0 },
  },
  {
    id: 'use-special',
    title: 'Domínio do Orbe do Vento',
    description: 'Use habilidade especial 3 vezes.',
    stat: 'specialUses',
    target: 3,
    reward: { coins: 35, xp: 25, rareScrolls: 0 },
  },
  {
    id: 'defeat-boss',
    title: 'Queda do Guardião',
    description: 'Derrote 1 chefe.',
    stat: 'bossesDefeated',
    target: 1,
    reward: { coins: 80, xp: 55, rareScrolls: 1 },
  },
];

export const ACHIEVEMENTS = [
  {
    id: 'first-blood',
    title: 'Primeiro Corte',
    description: 'Derrote seu primeiro inimigo.',
    stat: 'lifetimeEnemiesDefeated',
    target: 1,
    reward: { coins: 20, xp: 10, rareScrolls: 0 },
  },
  {
    id: 'coin-hunter-100',
    title: 'Colecionador Espiritual',
    description: 'Colete 100 moedas no total.',
    stat: 'lifetimeCoinsCollected',
    target: 100,
    reward: { coins: 60, xp: 35, rareScrolls: 0 },
  },
  {
    id: 'wind-orb-apprentice',
    title: 'Aprendiz do Vento',
    description: 'Use o Orbe do Vento 25 vezes.',
    stat: 'lifetimeSpecialUses',
    target: 25,
    reward: { coins: 80, xp: 50, rareScrolls: 1 },
  },
  {
    id: 'kaizen-falls',
    title: 'Guardião Superado',
    description: 'Derrote Kaizen pela primeira vez.',
    stat: 'lifetimeBossesDefeated',
    target: 1,
    reward: { coins: 120, xp: 80, rareScrolls: 1 },
  },
  {
    id: 'seven-day-shadow',
    title: 'Sombra Persistente',
    description: 'Complete uma sequência de login de 7 dias.',
    stat: 'bestLoginStreak',
    target: 7,
    reward: { coins: 150, xp: 100, rareScrolls: 2 },
  },
];
