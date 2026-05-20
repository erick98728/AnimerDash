export default class SaveSystem {
  static key = 'kage-no-kiro-save';

  static getDefaultSave() {
    return {
      version: 6,
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
        hideMobileGameplayHelp: true,
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

  static clampNumber(value, min, max, fallback) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return fallback;
    return Math.min(Math.max(numericValue, min), max);
  }

  static toSafeNumber(value, fallback = 0) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
  }

  static normalizeStringArray(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((item) => typeof item === 'string' && item.length > 0))];
  }

  static normalizeNumberObject(defaultObject, loadedObject = {}) {
    return Object.fromEntries(
      Object.entries(defaultObject).map(([key, defaultValue]) => [
        key,
        Math.max(0, SaveSystem.toSafeNumber(loadedObject[key], defaultValue)),
      ]),
    );
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
      playerLevel: Math.max(1, Math.floor(SaveSystem.toSafeNumber(loaded.playerLevel, defaultSave.playerLevel))),
      xp: Math.max(0, SaveSystem.toSafeNumber(loaded.xp, defaultSave.xp)),
      coins: Math.max(0, SaveSystem.toSafeNumber(loaded.coins, defaultSave.coins)),
      rareScrolls: Math.max(0, SaveSystem.toSafeNumber(loaded.rareScrolls, defaultSave.rareScrolls)),
      skillPoints: Math.max(0, SaveSystem.toSafeNumber(loaded.skillPoints, defaultSave.skillPoints)),
      totalSkillPointsEarned: Math.max(
        0,
        SaveSystem.toSafeNumber(loaded.totalSkillPointsEarned, defaultSave.totalSkillPointsEarned),
      ),
      upgrades: SaveSystem.normalizeNumberObject(defaultSave.upgrades, loaded.upgrades),
      settings: {
        ...defaultSave.settings,
        ...loadedSettings,
        musicVolume: SaveSystem.clampNumber(loadedSettings.musicVolume, 0, 1, defaultSave.settings.musicVolume),
        sfxVolume: SaveSystem.clampNumber(loadedSettings.sfxVolume, 0, 1, defaultSave.settings.sfxVolume),
        showTouchControls: loadedSettings.showTouchControls ?? defaultSave.settings.showTouchControls,
        touchControlsOpacity: SaveSystem.clampNumber(
          loadedSettings.touchControlsOpacity,
          0.25,
          1,
          defaultSave.settings.touchControlsOpacity,
        ),
        hideMobileGameplayHelp: loadedSettings.hideMobileGameplayHelp ?? defaultSave.settings.hideMobileGameplayHelp,
      },
      completedLevels: SaveSystem.normalizeStringArray(loaded.completedLevels),
      unlockedSkills: SaveSystem.normalizeStringArray(loaded.unlockedSkills),
      specialItems: SaveSystem.normalizeStringArray(loaded.specialItems),
      retention: {
        ...defaultSave.retention,
        ...loadedRetention,
        loginStreak: Math.max(0, SaveSystem.toSafeNumber(loadedRetention.loginStreak, defaultSave.retention.loginStreak)),
        bestLoginStreak: Math.max(
          0,
          SaveSystem.toSafeNumber(loadedRetention.bestLoginStreak, defaultSave.retention.bestLoginStreak),
        ),
        dailyStats: SaveSystem.normalizeNumberObject(
          defaultSave.retention.dailyStats,
          loadedRetention.dailyStats,
        ),
        lifetimeStats: SaveSystem.normalizeNumberObject(
          defaultSave.retention.lifetimeStats,
          loadedRetention.lifetimeStats,
        ),
        claimedDailyMissions: loadedRetention.claimedDailyMissions && typeof loadedRetention.claimedDailyMissions === 'object'
          ? loadedRetention.claimedDailyMissions
          : defaultSave.retention.claimedDailyMissions,
        claimedAchievements: loadedRetention.claimedAchievements && typeof loadedRetention.claimedAchievements === 'object'
          ? loadedRetention.claimedAchievements
          : defaultSave.retention.claimedAchievements,
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
