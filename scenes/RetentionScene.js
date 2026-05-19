import RetentionSystem from '../systems/RetentionSystem.js';
import { DAILY_CHEST_REWARD, THREE_LEVELS_BONUS } from '../data/retentionData.js';

export default class RetentionScene extends Phaser.Scene {
  constructor() {
    super('RetentionScene');
  }

  create() {
    this.retentionSystem = new RetentionSystem();
    this.add.image(480, 270, 'mist-bg-placeholder');

    this.add.text(480, 34, 'Missões e Recompensas', {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.feedbackText = this.add.text(480, 512, '', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#ffd166',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.renderPanels();
  }

  renderPanels() {
    this.children.removeAll();
    this.add.image(480, 270, 'mist-bg-placeholder');

    this.add.text(480, 34, 'Missões e Recompensas', {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.createLoginPanel();
    this.createMissionPanel();
    this.createAchievementPanel();

    this.createButton(100, 506, 150, 'Voltar', () => this.scene.start('MenuScene'));
    this.createButton(270, 506, 150, 'Jogar', () => this.scene.start('GameScene'));

    this.feedbackText = this.add.text(650, 506, '', {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: '#ffd166',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  createLoginPanel() {
    const login = this.retentionSystem.getLoginRewardInfo();
    const state = this.retentionSystem.getState();

    this.add.rectangle(180, 250, 310, 390, 0x07111f, 0.74)
      .setStrokeStyle(1, 0x7be7ff, 0.35);

    this.add.text(180, 80, 'Login e Baú Diário', {
      fontFamily: 'Arial',
      fontSize: '19px',
      color: '#7be7ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(40, 112, [
      `Sequência atual: ${login.streak}/7`,
      `Melhor sequência: ${login.bestStreak}/7`,
      `Recompensa de hoje: ${login.reward.coins} moedas, ${login.reward.xp} XP, ${login.reward.rareScrolls} perg.`,
    ], {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#f2fbff',
      lineSpacing: 6,
    });

    this.createButton(180, 190, 220, login.canClaim ? 'Resgatar login' : 'Login resgatado', () => {
      const claimed = this.retentionSystem.claimDailyLoginReward();
      this.showResult(claimed, 'Recompensa diária resgatada.');
    }, !login.canClaim);

    this.add.text(40, 230, `Baú diário: ${DAILY_CHEST_REWARD.coins} moedas, ${DAILY_CHEST_REWARD.xp} XP`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#f2fbff',
    });

    this.createButton(180, 270, 220, this.retentionSystem.canClaimDailyChest() ? 'Abrir baú diário' : 'Baú aberto', () => {
      const claimed = this.retentionSystem.claimDailyChest();
      this.showResult(claimed, 'Baú diário aberto.');
    }, !this.retentionSystem.canClaimDailyChest());

    const canClaimThree = this.retentionSystem.canClaimThreeLevelsBonus();
    this.add.text(40, 318, [
      `Bônus 3 fases: ${state.dailyStats.levelsCompleted}/3`,
      `Prêmio: ${THREE_LEVELS_BONUS.coins} moedas, ${THREE_LEVELS_BONUS.xp} XP, ${THREE_LEVELS_BONUS.rareScrolls} perg.`,
    ], {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#f2fbff',
      lineSpacing: 6,
    });

    this.createButton(180, 385, 220, canClaimThree ? 'Resgatar bônus' : 'Bônus indisponível', () => {
      const claimed = this.retentionSystem.claimThreeLevelsBonus();
      this.showResult(claimed, 'Bônus de 3 fases resgatado.');
    }, !canClaimThree);
  }

  createMissionPanel() {
    const missions = this.retentionSystem.getDailyMissions();

    this.add.rectangle(505, 250, 330, 390, 0x07111f, 0.74)
      .setStrokeStyle(1, 0x7be7ff, 0.35);

    this.add.text(505, 80, 'Missões Diárias', {
      fontFamily: 'Arial',
      fontSize: '19px',
      color: '#7be7ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    missions.forEach((mission, index) => {
      const y = 120 + index * 68;
      const progress = mission.progress;
      const canClaim = progress.completed && !progress.claimed;
      const label = progress.claimed ? 'OK' : canClaim ? 'Resgatar' : `${progress.current}/${progress.target}`;

      this.add.text(360, y, mission.title, {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#f2fbff',
        fontStyle: 'bold',
      });

      this.add.text(360, y + 18, mission.description, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#9bb6c8',
      });

      this.add.text(360, y + 34, `Recompensa: ${mission.reward.coins} moedas, ${mission.reward.xp} XP`, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffd166',
      });

      this.createButton(620, y + 24, 100, label, () => {
        const claimed = this.retentionSystem.claimDailyMission(mission.id);
        this.showResult(claimed, 'Missão diária resgatada.');
      }, !canClaim);
    });
  }

  createAchievementPanel() {
    const achievements = this.retentionSystem.getAchievements();

    this.add.rectangle(815, 250, 260, 390, 0x07111f, 0.74)
      .setStrokeStyle(1, 0x7be7ff, 0.35);

    this.add.text(815, 80, 'Conquistas', {
      fontFamily: 'Arial',
      fontSize: '19px',
      color: '#7be7ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    achievements.forEach((achievement, index) => {
      const y = 120 + index * 68;
      const progress = achievement.progress;
      const canClaim = progress.completed && !progress.claimed;
      const label = progress.claimed ? 'OK' : canClaim ? 'Pegar' : `${progress.current}/${progress.target}`;

      this.add.text(700, y, achievement.title, {
        fontFamily: 'Arial',
        fontSize: '13px',
        color: '#f2fbff',
        fontStyle: 'bold',
      });

      this.add.text(700, y + 18, achievement.description, {
        fontFamily: 'Arial',
        fontSize: '11px',
        color: '#9bb6c8',
        wordWrap: { width: 150 },
      });

      this.createButton(885, y + 22, 80, label, () => {
        const claimed = this.retentionSystem.claimAchievement(achievement.id);
        this.showResult(claimed, 'Conquista resgatada.');
      }, !canClaim);
    });
  }

  createButton(x, y, width, label, callback, disabled = false) {
    const button = this.add.rectangle(x, y, width, 34, disabled ? 0x273241 : 0x18324a, disabled ? 0.65 : 0.95)
      .setStrokeStyle(2, disabled ? 0x536879 : 0x7be7ff)
      .setInteractive({ useHandCursor: !disabled });

    const text = this.add.text(x, y, label, {
      fontFamily: 'Arial',
      fontSize: '13px',
      color: disabled ? '#9bb6c8' : '#f2fbff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    if (!disabled) {
      button.on('pointerover', () => button.setFillStyle(0x24506f));
      button.on('pointerout', () => button.setFillStyle(0x18324a));
      button.on('pointerdown', callback);
    }

    return { button, text };
  }

  showResult(success, message) {
    this.renderPanels();
    this.feedbackText.setText(success ? message : 'Nada disponível para resgatar agora.');
  }
}
