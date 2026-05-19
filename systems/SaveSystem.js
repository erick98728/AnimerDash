export default class SaveSystem {
  static key = 'kage-no-kiro-save';

  static getDefaultSave() {
    return {
      version: 3,
      playerLevel: 1,
      xp: 0,
      coins: 0,
      rareScrolls: 0,
      skillPoints: 0,
      totalSkillPointsEarned: 0,
      completedLevels: [],
      unlockedSkills: [],
      specialItems: [],
      upgrades: {
        maxHealth: 0,
        attackDamage: 0,
        energy: 0,
        dash: 0,
        shuriken: 0,
      },
      retention: {
        lastLoginDate: null,
        loginStreak: 0,
        bestLoginStreak: 0,
        claimedLoginRewardDate: null,
        claimedDailyChestDate: null,
        claimedThreeLevelsBonusDate: null,
        dailyStatsDate: null,
        dailyStats: {
          enemiesDefeated: 0,
          coinsCollected: 0,
          levelsCompleted: 0,
          noDeathCompletions: 0,
          specialUses: 0,
          bossesDefeated: 0,
        },
        lifetimeStats: {
          lifetimeEnemiesDefeated: 0,
          lifetimeCoinsCollected: 0,
          lifetimeLevelsCompleted: 0,
          lifetimeNoDeathCompletions: 0,
          lifetimeSpecialUses: 0,
          lifetimeBossesDefeated: 0,
        },
        claimedDailyMissions: {},
        claimedAchievements: {},
      },
      lastPlayedAt: null,
    };
  }

  static normalizeSave(data) {
    const defaultSave = SaveSystem.getDefaultSave();
    const loaded = data ?? {};
    const loadedRetention = loaded.retention ?? {};

    return {
      ...defaultSave,
      ...loaded,
      version: defaultSave.version,
      upgrades: {
        ...defaultSave.upgrades,
        ...(loaded.upgrades ?? {}),
      },
      completedLevels: loaded.completedLevels ?? defaultSave.completedLevels,
      unlockedSkills: loaded.unlockedSkills ?? defaultSave.unlockedSkills,
      specialItems: loaded.specialItems ?? defaultSave.specialItems,
      retention: {
        ...defaultSave.retention,
        ...loadedRetention,
        dailyStats: {
          ...defaultSave.retention.dailyStats,
          ...(loadedRetention.dailyStats ?? {}),
        },
        lifetimeStats: {
          ...defaultSave.retention.lifetimeStats,
          ...(loadedRetention.lifetimeStats ?? {}),
        },
        claimedDailyMissions: loadedRetention.claimedDailyMissions ?? defaultSave.retention.claimedDailyMissions,
        claimedAchievements: loadedRetention.claimedAchievements ?? defaultSave.retention.claimedAchievements,
      },
    };
  }

  static load() {
    try {
      const rawSave = localStorage.getItem(SaveSystem.key);
      if (!rawSave) {
        return SaveSystem.getDefaultSave();
      }

      return SaveSystem.normalizeSave(JSON.parse(rawSave));
    } catch (error) {
      console.warn('Não foi possível carregar o progresso. Um novo save será usado.', error);
      return SaveSystem.getDefaultSave();
    }
  }

  static save(data) {
    const nextSave = SaveSystem.normalizeSave({
      ...data,
      lastPlayedAt: new Date().toISOString(),
    });

    localStorage.setItem(SaveSystem.key, JSON.stringify(nextSave));
    return nextSave;
  }

  static reset() {
    localStorage.removeItem(SaveSystem.key);
    return SaveSystem.getDefaultSave();
  }
}
