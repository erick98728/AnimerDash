import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import UpgradeScene from './scenes/UpgradeScene.js';
import RetentionScene from './scenes/RetentionScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene from './scenes/VictoryScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 540,
  backgroundColor: '#07111f',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      // Gravidade um pouco mais forte deixa o pulo com peso e resposta melhor.
      gravity: { y: 1050 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    MenuScene,
    GameScene,
    UpgradeScene,
    RetentionScene,
    GameOverScene,
    VictoryScene,
  ],
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
