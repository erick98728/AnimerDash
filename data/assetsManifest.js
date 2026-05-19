export const USE_REAL_ASSETS = false;

export const ASSET_MANIFEST = {
  player: {
    ren: {
      idle: {
        key: 'ren-kiro-idle',
        path: 'assets/sprites/player/ren_kiro_idle.png',
        fallback: 'player-idle-placeholder',
        frameWidth: 48,
        frameHeight: 56,
        frameRate: 6,
      },
      run: {
        key: 'ren-kiro-run',
        path: 'assets/sprites/player/ren_kiro_run.png',
        fallback: 'player-run-placeholder',
        frameWidth: 48,
        frameHeight: 56,
        frameRate: 12,
      },
      jump: {
        key: 'ren-kiro-jump',
        path: 'assets/sprites/player/ren_kiro_jump.png',
        fallback: 'player-jump-placeholder',
        frameWidth: 48,
        frameHeight: 56,
        frameRate: 1,
      },
      fall: {
        key: 'ren-kiro-fall',
        path: 'assets/sprites/player/ren_kiro_fall.png',
        fallback: 'player-fall-placeholder',
        frameWidth: 48,
        frameHeight: 56,
        frameRate: 1,
      },
      dash: {
        key: 'ren-kiro-dash',
        path: 'assets/sprites/player/ren_kiro_dash.png',
        fallback: 'player-dash-placeholder',
        frameWidth: 48,
        frameHeight: 56,
        frameRate: 1,
      },
    },
  },
  enemies: {
    weakNinja: {
      key: 'enemy-weak-ninja',
      path: 'assets/sprites/enemies/weak_ninja.png',
      fallback: 'enemy-weak-ninja-placeholder',
      frameWidth: 48,
      frameHeight: 56,
      frameRate: 8,
    },
    kunaiShooter: {
      key: 'enemy-kunai-shooter',
      path: 'assets/sprites/enemies/kunai_shooter.png',
      fallback: 'enemy-kunai-shooter-placeholder',
      frameWidth: 48,
      frameHeight: 56,
      frameRate: 8,
    },
    heavyGuardian: {
      key: 'enemy-heavy-guardian',
      path: 'assets/sprites/enemies/heavy_guardian.png',
      fallback: 'enemy-heavy-guardian-placeholder',
      frameWidth: 48,
      frameHeight: 56,
      frameRate: 7,
    },
    shadowNinja: {
      key: 'enemy-shadow-ninja',
      path: 'assets/sprites/enemies/shadow_ninja.png',
      fallback: 'enemy-shadow-ninja-placeholder',
      frameWidth: 48,
      frameHeight: 56,
      frameRate: 10,
    },
  },
  bosses: {
    kaizen: {
      key: 'boss-kaizen',
      path: 'assets/sprites/bosses/kaizen.png',
      fallback: 'boss-kaizen-placeholder',
      frameWidth: 60,
      frameHeight: 72,
      frameRate: 8,
    },
  },
  collectibles: {
    coin: {
      key: 'ui-coin-icon',
      path: 'assets/ui/icons/coin.png',
      fallback: 'collectible-placeholder',
    },
    xp: {
      key: 'ui-xp-icon',
      path: 'assets/ui/icons/xp.png',
      fallback: 'xp-placeholder',
    },
  },
  tilesets: {
    forest: {
      key: 'tileset-forest',
      path: 'assets/tilesets/forest_tileset.png',
      fallback: 'platform-placeholder',
      tileWidth: 16,
      tileHeight: 16,
    },
    ninjaVillage: {
      key: 'tileset-ninja-village',
      path: 'assets/tilesets/ninja_village_tileset.png',
      fallback: 'platform-placeholder',
      tileWidth: 16,
      tileHeight: 16,
    },
  },
  backgrounds: {
    mistForest: {
      key: 'bg-mist-forest',
      path: 'assets/backgrounds/mist_forest.png',
      fallback: 'mist-bg-placeholder',
    },
    ninjaVillage: {
      key: 'bg-ninja-village',
      path: 'assets/backgrounds/ninja_village.png',
      fallback: 'mist-bg-placeholder',
    },
    bossArena: {
      key: 'bg-boss-arena',
      path: 'assets/backgrounds/boss_arena.png',
      fallback: 'mist-bg-placeholder',
    },
  },
  ui: {
    button: {
      key: 'ui-button',
      path: 'assets/ui/buttons/button_base.png',
      fallback: null,
    },
    panel: {
      key: 'ui-panel',
      path: 'assets/ui/panels/panel_base.png',
      fallback: null,
    },
    healthIcon: {
      key: 'ui-health-icon',
      path: 'assets/ui/icons/health.png',
      fallback: null,
    },
    energyIcon: {
      key: 'ui-energy-icon',
      path: 'assets/ui/icons/energy.png',
      fallback: null,
    },
    shurikenIcon: {
      key: 'ui-shuriken-icon',
      path: 'assets/ui/icons/shuriken.png',
      fallback: null,
    },
    windOrbIcon: {
      key: 'ui-wind-orb-icon',
      path: 'assets/ui/icons/wind_orb.png',
      fallback: null,
    },
  },
};

export function flattenAssets(manifest = ASSET_MANIFEST) {
  const assets = [];

  function walk(value) {
    if (!value || typeof value !== 'object') return;

    if (value.key && value.path) {
      assets.push(value);
      return;
    }

    Object.values(value).forEach(walk);
  }

  walk(manifest);
  return assets;
}

export function getTextureKey(scene, assetEntry, fallbackKey) {
  if (assetEntry?.key && scene.textures.exists(assetEntry.key)) {
    return assetEntry.key;
  }

  if (assetEntry?.fallback && scene.textures.exists(assetEntry.fallback)) {
    return assetEntry.fallback;
  }

  return fallbackKey;
}
