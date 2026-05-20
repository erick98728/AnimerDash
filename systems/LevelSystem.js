import Enemy from '../entities/Enemy.js';
import Boss from '../entities/Boss.js';
import Collectible from '../entities/Collectible.js';
import { ASSET_MANIFEST, getTextureKey } from '../data/assetsManifest.js';
import { GAME_DATA } from '../data/gameData.js';
import { getFirstLevel, getLevelById, LEVELS } from '../data/levels.js';

export default class LevelSystem {
  constructor(scene) {
    this.scene = scene;
  }

  getLevel(levelIdOrIndex) {
    if (typeof levelIdOrIndex === 'number') {
      return LEVELS[levelIdOrIndex] ?? getFirstLevel();
    }

    if (levelIdOrIndex === 'boss-prototype') {
      return this.createBossPrototypeLevel();
    }

    return getLevelById(levelIdOrIndex) ?? getFirstLevel();
  }

  createBossPrototypeLevel() {
    const { left, right } = GAME_DATA.boss.arena;

    return {
      id: 'boss-prototype',
      name: 'Arena de Kaizen',
      visualTheme: 'templo tomado por névoa ciano e corrupção roxa',
      objective: `derrotar ${GAME_DATA.boss.name}`,
      difficulty: 10,
      isBossLevel: true,
      backgroundKey: 'bossArena',
      reward: {
        coins: GAME_DATA.boss.rewards.coins,
        xp: GAME_DATA.boss.rewards.xp,
        rareScrolls: 1,
        specialItem: GAME_DATA.boss.rewards.specialItem,
        unlockedSkill: GAME_DATA.boss.rewards.unlockedSkill,
      },
      world: {
        width: 1700,
        height: 540,
        startPosition: { x: 90, y: 420 },
        endPoint: { x: 1580, y: 450, width: 48, height: 76 },
      },
      platforms: [
        { x: 160, y: 510, scaleX: 2.2 },
        { x: 470, y: 430, scaleX: 1.2 },
        { x: 720, y: 350, scaleX: 1.1 },
        { x: 980, y: 450, scaleX: 1.4 },
        { x: 1310, y: 510, scaleX: 3.6 },
      ],
      enemies: [
        { type: 'weakNinja', x: 410, y: 450 },
        { type: 'kunaiShooter', x: 650, y: 370 },
        { type: 'shadowNinja', x: 930, y: 390 },
      ],
      boss: {
        x: 1340,
        y: 430,
        arena: { left, right },
      },
      coins: [
        { x: 260, y: 455, value: 1 },
        { x: 470, y: 380, value: 1 },
        { x: 720, y: 300, value: 1 },
        { x: 980, y: 400, value: 1 },
        { x: 1160, y: 455, value: 1 },
      ],
      obstacles: [],
    };
  }

  build(levelData) {
    this.levelData = levelData;
    this.createWorld(levelData);
    this.createBackground(levelData);
    this.createPlatforms(levelData.platforms ?? []);
    this.createObstacles(levelData.obstacles ?? []);
    this.createEndPoint(levelData.world?.endPoint);

    return {
      platforms: this.platforms,
      obstacles: this.obstacles,
      endPoint: this.endPoint,
    };
  }

  createWorld(levelData) {
    const world = levelData.world ?? { width: 1700, height: 540 };
    this.scene.physics.world.setBounds(0, 0, world.width, world.height);
    this.scene.cameras.main.setBounds(0, 0, world.width, world.height);
  }

  getBackgroundAsset(levelData) {
    if (levelData.backgroundKey && ASSET_MANIFEST.backgrounds[levelData.backgroundKey]) {
      return ASSET_MANIFEST.backgrounds[levelData.backgroundKey];
    }

    if (levelData.isBossLevel || levelData.boss) {
      return ASSET_MANIFEST.backgrounds.bossArena;
    }

    const theme = `${levelData.visualTheme ?? ''}`.toLowerCase();
    if (theme.includes('vila')) {
      return ASSET_MANIFEST.backgrounds.ninjaVillage;
    }

    return ASSET_MANIFEST.backgrounds.mistForest;
  }

  getPlatformTextureKey() {
    // Ainda não usa tilemap complexo. Esta função deixa as plataformas prontas
    // para uma próxima etapa com tileset real, mantendo o placeholder atual.
    return getTextureKey(this.scene, ASSET_MANIFEST.tilesets.forest, 'platform-placeholder');
  }

  createBackground(levelData) {
    const world = levelData.world ?? { width: 960, height: 540 };
    const backgroundAsset = this.getBackgroundAsset(levelData);
    const backgroundKey = getTextureKey(this.scene, backgroundAsset, 'mist-bg-placeholder');
    const background = this.scene.add.image(480, 270, backgroundKey);
    background.setScrollFactor(0.15);

    const texture = this.scene.textures.get(backgroundKey);
    const source = texture?.getSourceImage?.();
    const scaleX = source?.width ? 960 / source.width : 1;
    const scaleY = source?.height ? 540 / source.height : 1;
    background.setScale(Math.max(scaleX, scaleY));

    const title = this.scene.add.text(34, 34, `${levelData.name} | Dif. ${levelData.difficulty ?? '-'}`, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#9bb6c8',
    }).setScrollFactor(0);

    const objective = this.scene.add.text(34, 56, levelData.objective ?? 'Complete a fase', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#7be7ff',
    }).setScrollFactor(0);

    this.scene.add.rectangle(world.width / 2, 520, world.width, 40, 0x07111f, 0.25);
    return { background, title, objective };
  }

  createPlatforms(platformData) {
    this.platforms = this.scene.physics.add.staticGroup();
    const platformTextureKey = this.getPlatformTextureKey();

    platformData.forEach((platform) => {
      const sprite = this.platforms.create(platform.x, platform.y, platform.textureKey ?? platformTextureKey);
      sprite.setScale(platform.scaleX ?? 1, platform.scaleY ?? 1).refreshBody();
    });

    return this.platforms;
  }

  createObstacles(obstacleData) {
    this.obstacles = this.scene.physics.add.staticGroup();

    obstacleData.forEach((obstacle) => {
      const colorByType = {
        spikes: 0xff6b6b,
        fire: 0xffd166,
        pit: 0x5d3fd3,
      };

      const obstacleSprite = this.scene.add.rectangle(
        obstacle.x,
        obstacle.y,
        obstacle.width ?? 80,
        obstacle.height ?? 22,
        colorByType[obstacle.type] ?? 0xff6b6b,
        obstacle.type === 'pit' ? 0.18 : 0.7,
      );

      obstacleSprite.type = obstacle.type;
      obstacleSprite.damage = obstacle.damage ?? 10;
      this.scene.physics.add.existing(obstacleSprite, true);
      this.obstacles.add(obstacleSprite);

      if (obstacle.type !== 'pit') {
        obstacleSprite.setStrokeStyle?.(2, 0xf2fbff, 0.2);
      }
    });

    return this.obstacles;
  }

  createEndPoint(endPointData) {
    if (!endPointData) return null;

    this.endPoint = this.scene.add.rectangle(
      endPointData.x,
      endPointData.y,
      endPointData.width ?? 48,
      endPointData.height ?? 76,
      0x7be7ff,
      0.22,
    );

    this.endPoint.setStrokeStyle(2, 0xffd166, 0.85);
    this.scene.physics.add.existing(this.endPoint, true);

    this.scene.add.text(endPointData.x, endPointData.y - 58, 'SAÍDA', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffd166',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    return this.endPoint;
  }

  createPlayerSpawn() {
    return this.levelData?.world?.startPosition ?? { x: 90, y: 420 };
  }

  createEnemies(addEnemyCallback) {
    const enemies = this.levelData.enemies ?? [];

    enemies.forEach((enemyData) => {
      const enemy = new Enemy(this.scene, enemyData.x, enemyData.y, enemyData.type, enemyData.options ?? {});
      addEnemyCallback(enemy, false);
    });

    if (this.levelData.isBossLevel || this.levelData.boss) {
      const bossData = this.levelData.boss ?? { x: 1340, y: 430 };
      const boss = new Boss(this.scene, bossData.x, bossData.y);
      addEnemyCallback(boss, true);
      return boss;
    }

    return null;
  }

  createCollectibles(group) {
    const coins = this.levelData.coins ?? [];

    coins.forEach((coin) => {
      group.add(new Collectible(this.scene, coin.x, coin.y, coin.value ?? 1, coin.type ?? 'coin'));
    });
  }

  getReward() {
    return this.levelData.reward ?? { coins: 0, xp: 0 };
  }

  requiresBossDefeat() {
    return Boolean(this.levelData.isBossLevel || this.levelData.boss);
  }

  requiresAllEnemiesDefeated() {
    return Boolean(this.levelData.requireAllEnemiesDefeated);
  }
}
