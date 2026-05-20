import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import LevelSelectScene from './scenes/LevelSelectScene.js';
import GameScene from './scenes/GameScene.js';
import UpgradeScene from './scenes/UpgradeScene.js';
import RetentionScene from './scenes/RetentionScene.js';
import SettingsScene from './scenes/SettingsScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene from './scenes/VictoryScene.js';
import FullscreenSystem from './systems/FullscreenSystem.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 540,
  backgroundColor: '#07111f',
  pixelArt: true,
  input: {
    activePointers: 8,
  },
  physics: {
    default: 'arcade',
    arcade: {
      // Gravidade um pouco mais forte deixa o pulo com peso e resposta melhor.
      gravity: { y: 1050 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.NO_CENTER,
    width: 960,
    height: 540,
    min: {
      width: 320,
      height: 180,
    },
  },
  scene: [
    BootScene,
    MenuScene,
    LevelSelectScene,
    GameScene,
    UpgradeScene,
    RetentionScene,
    SettingsScene,
    GameOverScene,
    VictoryScene,
  ],
};

window.addEventListener('load', () => {
  window.game = new Phaser.Game(config);
  FullscreenSystem.install(window.game);
});
