export default class FullscreenSystem {
  static getTargetElement() {
    return document.getElementById('game-container')
      || document.querySelector('canvas')
      || document.documentElement;
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
      return { ok: true, message: 'Tela cheia ativada.' };
    } catch (error) {
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
      return { ok: true, message: 'Tela cheia desativada.' };
    } catch (error) {
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
