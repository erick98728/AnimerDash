export default class SaveSystem {
  static key = 'kage-no-kiro-save';

  static getDefaultSave() {
    return {
      version: 2,
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
      lastPlayedAt: null,
    };
  }

  static normalizeSave(data) {
    const defaultSave = SaveSystem.getDefaultSave();
    const loaded = data ?? {};

    return {
      ...defaultSave,
      ...loaded,
      upgrades: {
        ...defaultSave.upgrades,
        ...(loaded.upgrades ?? {}),
      },
      completedLevels: loaded.completedLevels ?? defaultSave.completedLevels,
      unlockedSkills: loaded.unlockedSkills ?? defaultSave.unlockedSkills,
      specialItems: loaded.specialItems ?? defaultSave.specialItems,
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
