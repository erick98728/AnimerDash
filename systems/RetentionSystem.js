import SaveSystem from './SaveSystem.js';
import ProgressionSystem from './ProgressionSystem.js';
import {
  ACHIEVEMENTS,
  DAILY_CHEST_REWARD,
  DAILY_LOGIN_REWARDS,
  DAILY_MISSIONS,
  THREE_LEVELS_BONUS,
} from '../data/retentionData.js';

export default class RetentionSystem {
  constructor() {
    this.save = SaveSystem.load();
    this.ensureToday();
  }

  getTodayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  getDateDiffInDays(previousDateKey, currentDateKey) {
    if (!previousDateKey) return null;

    const previous = new Date(`${previousDateKey}T00:00:00`);
    const current = new Date(`${currentDateKey}T00:00:00`);
    return Math.round((current - previous) / 86400000);
  }

  reload() {
    this.save = SaveSystem.load();
    return this.save;
  }

  updateSave(updater, { applyLevel = false } = {}) {
    this.save = SaveSystem.update((save) => {
      updater(save);
      return applyLevel ? ProgressionSystem.applyLevelFromXp(save) : save;
    });

    return this.save;
  }

  ensureToday() {
    const today = this.getTodayKey();

    this.updateSave((save) => {
      const retention = save.retention;

      if (retention.dailyStatsDate !== today) {
        retention.dailyStatsDate = today;
        retention.dailyStats = {
          enemiesDefeated: 0,
          coinsCollected: 0,
          levelsCompleted: 0,
          noDeathCompletions: 0,
          specialUses: 0,
          bossesDefeated: 0,
        };
        retention.claimedDailyMissions = {};
      }

      if (retention.lastLoginDate !== today) {
        const diff = this.getDateDiffInDays(retention.lastLoginDate, today);

        if (diff === 1) {
          retention.loginStreak += 1;
        } else if (diff === null) {
          retention.loginStreak = 1;
        } else if (diff > 1) {
          retention.loginStreak = 1;
        }

        retention.lastLoginDate = today;
        retention.bestLoginStreak = Math.max(retention.bestLoginStreak, retention.loginStreak);
      }
    });
  }

  getState() {
    this.ensureToday();
    return this.save.retention;
  }

  addReward(reward) {
    this.updateSave((save) => {
      ProgressionSystem.addRewardToSave(save, reward);
    }, { applyLevel: true });
  }

  getLoginRewardInfo() {
    this.ensureToday();
    const today = this.getTodayKey();
    const streakIndex = Math.min(Math.max(this.save.retention.loginStreak, 1), 7) - 1;

    return {
      canClaim: this.save.retention.claimedLoginRewardDate !== today,
      streak: this.save.retention.loginStreak,
      bestStreak: this.save.retention.bestLoginStreak,
      reward: DAILY_LOGIN_REWARDS[streakIndex],
    };
  }

  claimDailyLoginReward() {
    const today = this.getTodayKey();
    const info = this.getLoginRewardInfo();

    if (!info.canClaim) return false;

    this.updateSave((save) => {
      ProgressionSystem.addRewardToSave(save, info.reward);
      save.retention.claimedLoginRewardDate = today;
    }, { applyLevel: true });

    return true;
  }

  canClaimDailyChest() {
    this.ensureToday();
    return this.save.retention.claimedDailyChestDate !== this.getTodayKey();
  }

  claimDailyChest() {
    if (!this.canClaimDailyChest()) return false;
    const today = this.getTodayKey();

    this.updateSave((save) => {
      ProgressionSystem.addRewardToSave(save, DAILY_CHEST_REWARD);
      save.retention.claimedDailyChestDate = today;
    }, { applyLevel: true });

    return true;
  }

  canClaimThreeLevelsBonus() {
    this.ensureToday();
    return (
      this.save.retention.dailyStats.levelsCompleted >= 3
      && this.save.retention.claimedThreeLevelsBonusDate !== this.getTodayKey()
    );
  }

  claimThreeLevelsBonus() {
    if (!this.canClaimThreeLevelsBonus()) return false;
    const today = this.getTodayKey();

    this.updateSave((save) => {
      ProgressionSystem.addRewardToSave(save, THREE_LEVELS_BONUS);
      save.retention.claimedThreeLevelsBonusDate = today;
    }, { applyLevel: true });

    return true;
  }

  addProgress(stat, amount = 1) {
    this.ensureToday();

    this.updateSave((save) => {
      if (Object.prototype.hasOwnProperty.call(save.retention.dailyStats, stat)) {
        save.retention.dailyStats[stat] += amount;
      }

      const lifetimeStat = `lifetime${stat.charAt(0).toUpperCase()}${stat.slice(1)}`;
      if (Object.prototype.hasOwnProperty.call(save.retention.lifetimeStats, lifetimeStat)) {
        save.retention.lifetimeStats[lifetimeStat] += amount;
      }
    });
  }

  recordEnemyDefeated(amount = 1) {
    this.addProgress('enemiesDefeated', amount);
  }

  recordCoinsCollected(amount = 1) {
    this.addProgress('coinsCollected', amount);
  }

  recordSpecialUse(amount = 1) {
    this.addProgress('specialUses', amount);
  }

  recordBossDefeated(amount = 1) {
    this.addProgress('bossesDefeated', amount);
  }

  recordLevelCompleted({ noDeath = true } = {}) {
    this.addProgress('levelsCompleted', 1);

    if (noDeath) {
      this.addProgress('noDeathCompletions', 1);
    }
  }

  getDailyMissionProgress(mission) {
    this.reload();
    const current = this.save.retention.dailyStats[mission.stat] ?? 0;
    return {
      current,
      target: mission.target,
      completed: current >= mission.target,
      claimed: Boolean(this.save.retention.claimedDailyMissions[mission.id]),
    };
  }

  getDailyMissions() {
    this.ensureToday();
    return DAILY_MISSIONS.map((mission) => ({
      ...mission,
      progress: this.getDailyMissionProgress(mission),
    }));
  }

  claimDailyMission(missionId) {
    this.ensureToday();
    const mission = DAILY_MISSIONS.find((item) => item.id === missionId);
    if (!mission) return false;

    const progress = this.getDailyMissionProgress(mission);
    if (!progress.completed || progress.claimed) return false;

    const today = this.getTodayKey();
    this.updateSave((save) => {
      ProgressionSystem.addRewardToSave(save, mission.reward);
      save.retention.claimedDailyMissions[mission.id] = today;
    }, { applyLevel: true });

    return true;
  }

  getAchievementProgress(achievement) {
    this.reload();
    const lifetimeValue = this.save.retention.lifetimeStats[achievement.stat] ?? this.save.retention[achievement.stat] ?? 0;
    return {
      current: lifetimeValue,
      target: achievement.target,
      completed: lifetimeValue >= achievement.target,
      claimed: Boolean(this.save.retention.claimedAchievements[achievement.id]),
    };
  }

  getAchievements() {
    this.ensureToday();
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      progress: this.getAchievementProgress(achievement),
    }));
  }

  claimAchievement(achievementId) {
    this.ensureToday();
    const achievement = ACHIEVEMENTS.find((item) => item.id === achievementId);
    if (!achievement) return false;

    const progress = this.getAchievementProgress(achievement);
    if (!progress.completed || progress.claimed) return false;

    const today = this.getTodayKey();
    this.updateSave((save) => {
      ProgressionSystem.addRewardToSave(save, achievement.reward);
      save.retention.claimedAchievements[achievement.id] = today;
    }, { applyLevel: true });

    return true;
  }
}
