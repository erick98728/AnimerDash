export default class FullscreenSystem {
  static game = null;
  static resizeTimeout = null;
  static targetRatio = 16 / 9;

  static install(game) {
    FullscreenSystem.game = game;
    FullscreenSystem.updateFullscreenClass();
    FullscreenSystem.applyBestFitLayout();

    const refresh = () => FullscreenSystem.scheduleLayoutRefresh();

    document.addEventListener('fullscreenchange', refresh);
    document.addEventListener('webkitfullscreenchange', refresh);
    document.addEventListener('msfullscreenchange', refresh);
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);

    // Alguns navegadores mobile atualizam innerHeight com atraso após fullscreen/orientação.
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

  static calculateBestFitSize() {
    const { width: viewportWidth, height: viewportHeight } = FullscreenSystem.getViewportSize();
    const viewportRatio = viewportWidth / viewportHeight;
    let width;
    let height;

    if (viewportRatio > FullscreenSystem.targetRatio) {
      height = viewportHeight;
      width = Math.floor(height * FullscreenSystem.targetRatio);
    } else {
      width = viewportWidth;
      height = Math.floor(width / FullscreenSystem.targetRatio);
    }

    return {
      width: Math.max(320, Math.floor(width)),
      height: Math.max(180, Math.floor(height)),
      viewportWidth,
      viewportHeight,
    };
  }

  static applyBestFitLayout() {
    const container = FullscreenSystem.getGameContainer();
    if (!container) return;

    const isMobileLike = window.matchMedia('(pointer: coarse), (max-width: 940px)').matches;
    const shouldUseManagedLayout = isMobileLike || FullscreenSystem.isFullscreen();

    if (!shouldUseManagedLayout) {
      container.style.removeProperty('width');
      container.style.removeProperty('height');
      container.style.removeProperty('max-width');
      container.style.removeProperty('max-height');
      FullscreenSystem.refreshPhaserScale();
      return;
    }

    const { width, height } = FullscreenSystem.calculateBestFitSize();
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.maxWidth = '100vw';
    container.style.maxHeight = '100dvh';

    FullscreenSystem.refreshPhaserScale();
  }

  static refreshPhaserScale() {
    const game = FullscreenSystem.game || window.game;
    if (!game?.scale) return;

    game.scale.refresh();

    game.scene?.getScenes?.(true)?.forEach((scene) => {
      scene.scale?.refresh?.();
      scene.touchControlsSystem?.updateLayout?.();
      scene.hudSystem?.applySettings?.();
    });
  }

  static scheduleLayoutRefresh() {
    window.clearTimeout(FullscreenSystem.resizeTimeout);
    FullscreenSystem.updateFullscreenClass();

    FullscreenSystem.resizeTimeout = window.setTimeout(() => {
      FullscreenSystem.updateFullscreenClass();
      FullscreenSystem.applyBestFitLayout();
    }, 80);

    window.setTimeout(() => FullscreenSystem.applyBestFitLayout(), 260);
    window.setTimeout(() => FullscreenSystem.applyBestFitLayout(), 520);
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
