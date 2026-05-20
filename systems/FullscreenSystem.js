export default class FullscreenSystem {
  static game = null;
  static resizeTimeout = null;
  static baseHeight = 540;
  static minBaseWidth = 960;

  static install(game) {
    FullscreenSystem.game = game;
    FullscreenSystem.updateFullscreenClass();
    FullscreenSystem.applyDynamicViewport();

    const refresh = () => FullscreenSystem.scheduleLayoutRefresh();

    document.addEventListener('fullscreenchange', refresh);
    document.addEventListener('webkitfullscreenchange', refresh);
    document.addEventListener('msfullscreenchange', refresh);
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);

    setTimeout(refresh, 120);
    setTimeout(refresh, 420);
  }

  static getTargetElement() {
    return document.querySelector('.game-wrapper')
      || document.querySelector('.page-shell')
      || document.documentElement;
  }

  static getGameContainer() {
    return document.getElementById('game-container');
  }

  static isSupported() {
    const target = FullscreenSystem.getTargetElement();

    return Boolean(
      target?.requestFullscreen
      || target?.webkitRequestFullscreen
      || target?.msRequestFullscreen
    );
  }

  static isFullscreen() {
    return Boolean(
      document.fullscreenElement
      || document.webkitFullscreenElement
      || document.msFullscreenElement
    );
  }

  static updateFullscreenClass() {
    const isFullscreen = FullscreenSystem.isFullscreen();
    document.documentElement.classList.toggle('is-fullscreen', isFullscreen);
    document.body.classList.toggle('is-fullscreen', isFullscreen);
    FullscreenSystem.getGameContainer()?.classList.toggle('is-fullscreen', isFullscreen);
  }

  static getViewportSize() {
    const visualViewport = window.visualViewport;
    const width = Math.floor(visualViewport?.width || window.innerWidth || document.documentElement.clientWidth || 960);
    const height = Math.floor(visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 540);

    return { width, height };
  }

  static isMobileLike() {
    return window.matchMedia('(pointer: coarse), (max-width: 940px)').matches;
  }

  static shouldUseDynamicViewport() {
    return FullscreenSystem.isMobileLike() || FullscreenSystem.isFullscreen();
  }

  static calculateDynamicViewport() {
    const { width: viewportWidth, height: viewportHeight } = FullscreenSystem.getViewportSize();
    const safeWidth = Math.max(320, viewportWidth);
    const safeHeight = Math.max(180, viewportHeight);
    const screenRatio = safeWidth / safeHeight;
    const dynamicWidth = Math.max(
      FullscreenSystem.minBaseWidth,
      Math.round(FullscreenSystem.baseHeight * screenRatio),
    );

    return {
      logicalWidth: dynamicWidth,
      logicalHeight: FullscreenSystem.baseHeight,
      physicalWidth: safeWidth,
      physicalHeight: safeHeight,
    };
  }

  static applyDynamicViewport() {
    const game = FullscreenSystem.game || window.game;
    const container = FullscreenSystem.getGameContainer();
    if (!game?.scale || !container) return;

    if (!FullscreenSystem.shouldUseDynamicViewport()) {
      container.style.removeProperty('width');
      container.style.removeProperty('height');
      container.style.removeProperty('max-width');
      container.style.removeProperty('max-height');
      game.scale.resize(FullscreenSystem.minBaseWidth, FullscreenSystem.baseHeight);
      FullscreenSystem.refreshScenes();
      return;
    }

    const viewport = FullscreenSystem.calculateDynamicViewport();

    container.style.width = `${viewport.physicalWidth}px`;
    container.style.height = `${viewport.physicalHeight}px`;
    container.style.maxWidth = '100vw';
    container.style.maxHeight = '100dvh';

    game.scale.resize(viewport.logicalWidth, viewport.logicalHeight);
    FullscreenSystem.refreshScenes();
  }

  static refreshScenes() {
    const game = FullscreenSystem.game || window.game;
    if (!game?.scene) return;

    game.scale?.refresh?.();

    game.scene.getScenes(true).forEach((scene) => {
      const width = scene.scale.width;
      const height = scene.scale.height;

      scene.cameras?.main?.setViewport?.(0, 0, width, height);
      scene.scale?.refresh?.();
      scene.refreshLayout?.();
      scene.touchControlsSystem?.updateLayout?.();
      scene.hudSystem?.applySettings?.();
      scene.pauseSystem?.refreshLayout?.();
      scene.dialogueSystem?.refreshLayout?.();
    });
  }

  static scheduleLayoutRefresh() {
    window.clearTimeout(FullscreenSystem.resizeTimeout);
    FullscreenSystem.updateFullscreenClass();

    FullscreenSystem.resizeTimeout = window.setTimeout(() => {
      FullscreenSystem.updateFullscreenClass();
      FullscreenSystem.applyDynamicViewport();
    }, 80);

    window.setTimeout(() => FullscreenSystem.applyDynamicViewport(), 260);
    window.setTimeout(() => FullscreenSystem.applyDynamicViewport(), 520);
  }

  static async enter() {
    const target = FullscreenSystem.getTargetElement();
    if (!target) {
      return { ok: false, message: 'Elemento do jogo não encontrado.' };
    }

    const request = target.requestFullscreen
      || target.webkitRequestFullscreen
      || target.msRequestFullscreen;

    if (!request) {
      return { ok: false, message: 'Tela cheia não é suportada neste navegador.' };
    }

    try {
      await request.call(target);
      FullscreenSystem.scheduleLayoutRefresh();
      return { ok: true, message: 'Tela cheia ativada.' };
    } catch (error) {
      FullscreenSystem.scheduleLayoutRefresh();
      return {
        ok: false,
        message: 'O navegador bloqueou a tela cheia. Toque no botão novamente ou use o menu do navegador.',
      };
    }
  }

  static async exit() {
    const exit = document.exitFullscreen
      || document.webkitExitFullscreen
      || document.msExitFullscreen;

    if (!exit) {
      return { ok: false, message: 'Não foi possível sair da tela cheia neste navegador.' };
    }

    try {
      await exit.call(document);
      FullscreenSystem.scheduleLayoutRefresh();
      return { ok: true, message: 'Tela cheia desativada.' };
    } catch (error) {
      FullscreenSystem.scheduleLayoutRefresh();
      return { ok: false, message: 'Não foi possível sair da tela cheia.' };
    }
  }

  static async toggle() {
    if (!FullscreenSystem.isSupported()) {
      return { ok: false, message: 'Tela cheia não é suportada neste navegador.' };
    }

    if (FullscreenSystem.isFullscreen()) {
      return FullscreenSystem.exit();
    }

    return FullscreenSystem.enter();
  }
}
