export default class SaveSystem {
  static key = 'kage-no-kiro-save';

  static getDefaultSave() {
    return {
      coins: 0,
      completedLevels: [],
      upgrades: {
        maxHealth: 0,
        attackDamage: 0,
        energy: 0,
      },
      lastPlayedAt: null,
    };
  }

  static load() {
    try {
      const rawSave = localStorage.getItem(SaveSystem.key);
      if (!rawSave) {
        return SaveSystem.getDefaultSave();
      }

      return {
        ...SaveSystem.getDefaultSave(),
        ...JSON.parse(rawSave),
      };
    } catch (error) {
      console.warn('Não foi possível carregar o progresso. Um novo save será usado.', error);
      return SaveSystem.getDefaultSave();
    }
  }

  static save(data) {
    const nextSave = {
      ...SaveSystem.getDefaultSave(),
      ...data,
      lastPlayedAt: new Date().toISOString(),
    };

    localStorage.setItem(SaveSystem.key, JSON.stringify(nextSave));
    return nextSave;
  }

  static reset() {
    localStorage.removeItem(SaveSystem.key);
    return SaveSystem.getDefaultSave();
  }
}
