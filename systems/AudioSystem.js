import SaveSystem from './SaveSystem.js';

export const AUDIO_KEYS = {
  music: {
    menu: 'music-menu',
    level: 'music-level',
    boss: 'music-boss',
  },
  sfx: {
    jump: 'sfx-jump',
    dash: 'sfx-dash',
    attack: 'sfx-attack',
    shuriken: 'sfx-shuriken',
    windOrb: 'sfx-wind-orb',
    damage: 'sfx-damage',
    coin: 'sfx-coin',
    xp: 'sfx-xp',
    victory: 'sfx-victory',
    defeat: 'sfx-defeat',
  },
};

export const AUDIO_MANIFEST = {
  music: [
    { key: AUDIO_KEYS.music.menu, path: 'assets/audio/music/menu_theme.ogg', fallback: 'menu' },
    { key: AUDIO_KEYS.music.level, path: 'assets/audio/music/level_theme.ogg', fallback: 'level' },
    { key: AUDIO_KEYS.music.boss, path: 'assets/audio/music/boss_theme.ogg', fallback: 'boss' },
  ],
  sfx: [
    { key: AUDIO_KEYS.sfx.jump, path: 'assets/audio/sfx/jump.ogg', fallback: 'jump' },
    { key: AUDIO_KEYS.sfx.dash, path: 'assets/audio/sfx/dash.ogg', fallback: 'dash' },
    { key: AUDIO_KEYS.sfx.attack, path: 'assets/audio/sfx/attack.ogg', fallback: 'attack' },
    { key: AUDIO_KEYS.sfx.shuriken, path: 'assets/audio/sfx/shuriken.ogg', fallback: 'shuriken' },
    { key: AUDIO_KEYS.sfx.windOrb, path: 'assets/audio/sfx/wind_orb.ogg', fallback: 'windOrb' },
    { key: AUDIO_KEYS.sfx.damage, path: 'assets/audio/sfx/damage.ogg', fallback: 'damage' },
    { key: AUDIO_KEYS.sfx.coin, path: 'assets/audio/sfx/coin.ogg', fallback: 'coin' },
    { key: AUDIO_KEYS.sfx.xp, path: 'assets/audio/sfx/xp.ogg', fallback: 'xp' },
    { key: AUDIO_KEYS.sfx.victory, path: 'assets/audio/sfx/victory.ogg', fallback: 'victory' },
    { key: AUDIO_KEYS.sfx.defeat, path: 'assets/audio/sfx/defeat.ogg', fallback: 'defeat' },
  ],
};

const PLACEHOLDER_SFX = {
  jump: { frequency: 520, endFrequency: 760, duration: 0.12, type: 'triangle' },
  dash: { frequency: 280, endFrequency: 720, duration: 0.11, type: 'sawtooth' },
  attack: { frequency: 360, endFrequency: 180, duration: 0.08, type: 'square' },
  shuriken: { frequency: 740, endFrequency: 420, duration: 0.09, type: 'triangle' },
  windOrb: { frequency: 220, endFrequency: 620, duration: 0.22, type: 'sine' },
  damage: { frequency: 140, endFrequency: 90, duration: 0.16, type: 'sawtooth' },
  coin: { frequency: 880, endFrequency: 1320, duration: 0.12, type: 'sine' },
  xp: { frequency: 660, endFrequency: 980, duration: 0.1, type: 'triangle' },
  victory: { frequency: 523, endFrequency: 1046, duration: 0.35, type: 'sine' },
  defeat: { frequency: 220, endFrequency: 82, duration: 0.45, type: 'triangle' },
};

const PLACEHOLDER_MUSIC = {
  menu: { notes: [196, 247, 294, 247], interval: 520, wave: 'sine' },
  level: { notes: [174, 220, 261, 220], interval: 430, wave: 'triangle' },
  boss: { notes: [110, 147, 165, 147], interval: 360, wave: 'sawtooth' },
};

export default class AudioSystem {
  constructor(scene) {
    this.scene = scene;
    this.settings = SaveSystem.getSettings();
    this.currentMusicKey = null;
    this.currentMusic = null;
    this.placeholderMusicTimer = null;
    this.audioContext = null;
  }

  static preload(scene) {
    // Quando os arquivos reais existirem, descomente os carregamentos abaixo.
    // Mantemos comentado para evitar 404 durante o protótipo sem assets de áudio.
    // AUDIO_MANIFEST.music.forEach((audio) => scene.load.audio(audio.key, audio.path));
    // AUDIO_MANIFEST.sfx.forEach((audio) => scene.load.audio(audio.key, audio.path));
  }

  refreshSettings() {
    this.settings = SaveSystem.getSettings();
    if (this.currentMusic?.setVolume) {
      this.currentMusic.setVolume(this.settings.musicVolume);
    }
  }

  getAudioContext() {
    if (this.audioContext) return this.audioContext;

    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;

    this.audioContext = new Context();
    return this.audioContext;
  }

  unlock() {
    const context = this.getAudioContext();
    if (context?.state === 'suspended') {
      context.resume();
    }
  }

  playMusic(musicKey) {
    this.refreshSettings();
    if (this.currentMusicKey === musicKey) return;

    this.stopMusic();
    this.currentMusicKey = musicKey;

    if (this.scene.cache.audio.exists(musicKey)) {
      this.currentMusic = this.scene.sound.add(musicKey, {
        loop: true,
        volume: this.settings.musicVolume,
      });
      this.currentMusic.play();
      return;
    }

    const manifestItem = AUDIO_MANIFEST.music.find((item) => item.key === musicKey);
    this.playPlaceholderMusic(manifestItem?.fallback ?? 'level');
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic.destroy();
      this.currentMusic = null;
    }

    if (this.placeholderMusicTimer) {
      this.placeholderMusicTimer.remove(false);
      this.placeholderMusicTimer = null;
    }

    this.currentMusicKey = null;
  }

  playSfx(sfxKey) {
    this.refreshSettings();
    if (this.settings.sfxVolume <= 0) return;

    this.unlock();

    if (this.scene.cache.audio.exists(sfxKey)) {
      this.scene.sound.play(sfxKey, { volume: this.settings.sfxVolume });
      return;
    }

    const manifestItem = AUDIO_MANIFEST.sfx.find((item) => item.key === sfxKey);
    this.playPlaceholderSfx(manifestItem?.fallback ?? 'attack');
  }

  playPlaceholderSfx(type) {
    const config = PLACEHOLDER_SFX[type];
    if (!config) return;

    const context = this.getAudioContext();
    if (!context) return;

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, config.endFrequency), now + config.duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, this.settings.sfxVolume * 0.12), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + config.duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + config.duration + 0.02);
  }

  playPlaceholderMusic(type) {
    const config = PLACEHOLDER_MUSIC[type] ?? PLACEHOLDER_MUSIC.level;
    let index = 0;

    const playNote = () => {
      this.refreshSettings();
      if (this.settings.musicVolume <= 0) return;

      const context = this.getAudioContext();
      if (!context) return;

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const frequency = config.notes[index % config.notes.length];

      oscillator.type = config.wave;
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, this.settings.musicVolume * 0.045), now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.46);
      index += 1;
    };

    playNote();
    this.placeholderMusicTimer = this.scene.time.addEvent({
      delay: config.interval,
      loop: true,
      callback: playNote,
    });
  }
}
