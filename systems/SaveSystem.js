export default class SaveSystem {
  static key = 'kage-no-kiro-save';

  static getDefaultSave() {
    return {
      version: 5,
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
      settings: {
        musicVolume: 0.7,
        sfxVolume: 0.8,
        showTouchControls: true,
        touchControlsOpacity: 0.72,
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
    const loadedSettings = loaded.settings ?? {};

    return {
      ...defaultSave,
      ...loaded,
      version: defaultSave.version,
      playerLevel: Number.isFinite(loaded.playerLevel) ? loaded.playerLevel : defaultSave.playerLevel,
      xp: Number.isFinite(loaded.xp) ? loaded.xp : defaultSave.xp,
      coins: Number.isFinite(loaded.coins) ? loaded.coins : defaultSave.coins,
      rareScrolls: Number.isFinite(loaded.rareScrolls) ? loaded.rareScrolls : defaultSave.rareScrolls,
      skillPoints: Number.isFinite(loaded.skillPoints) ? loaded.skillPoints : defaultSave.skillPoints,
      totalSkillPointsEarned: Number.isFinite(loaded.totalSkillPointsEarned)
        ? loaded.totalSkillPointsEarned
        : defaultSave.totalSkillPointsEarned,
      upgrades: {
        ...defaultSave.upgrades,
        ...(loaded.upgrades ?? {}),
      },
      settings: {
        ...defaultSave.settings,
        ...loadedSettings,
        musicVolume: Phaser?.Math?.Clamp?.(Number(loadedSettings.musicVolume ?? defaultSave.settings.musicVolume), 0, 1)
          ?? defaultSave.settings.musicVolume,
        sfxVolume: Phaser?.Math?.Clamp?.(Number(loadedSettings.sfxVolume ?? defaultSave.settings.sfxVolume), 0, 1)
          ?? defaultSave.settings.sfxVolume,
        showTouchControls: loadedSettings.showTouchControls ?? defaultSave.settings.showTouchControls,
        touchControlsOpacity: Phaser?.Math?.Clamp?.(Number(loadedSettings.touchControlsOpacity ?? defaultSave.settings.touchControlsOpacity), 0.25, 1)
          ?? defaultSave.settings.touchControlsOpacity,
      },
      completedLevels: Array.isArray(loaded.completedLevels) ? loaded.completedLevels : defaultSave.completedLevels,
      unlockedSkills: Array.isArray(loaded.unlockedSkills) ? loaded.unlockedSkills : defaultSave.unlockedSkills,
      specialItems: Array.isArray(loaded.specialItems) ? loaded.specialItems : defaultSave.specialItems,
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

  static update(updater) {
    const currentSave = SaveSystem.load();
    const result = updater(currentSave) ?? currentSave;
    return SaveSystem.save(result);
  }

  static getSettings() {
    return SaveSystem.load().settings;
  }

  static updateSettings(nextSettings) {
    return SaveSystem.update((save) => {
      save.settings = {
        ...save.settings,
        ...nextSettings,
      };
      return save;
    }).settings;
  }

  static reset() {
    localStorage.removeItem(SaveSystem.key);
    return SaveSystem.getDefaultSave();
  }
}
