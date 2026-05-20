export function markResponsiveBackground(scene, background, textureKey = 'mist-bg-placeholder') {
  background.setData('responsiveBackground', true);
  background.setData('responsiveTextureKey', textureKey);
  refreshBackground(scene, background);
  return background;
}

export function markFullScreenOverlay(overlay) {
  overlay.setData('fullScreenOverlay', true);
  return overlay;
}

export function captureResponsiveLayout(scene, options = {}) {
  const { baseWidth = 960, ignore = [] } = options;
  const ignoreSet = new Set(ignore);

  scene.children.list.forEach((child) => {
    if (!child || ignoreSet.has(child)) return;
    if (child.getData?.('responsiveBackground')) return;
    if (child.getData?.('fullScreenOverlay')) return;
    if (typeof child.x !== 'number' || typeof child.y !== 'number') return;
    if (child.getData?.('responsiveBaseCaptured')) return;

    child.setData('responsiveBaseCaptured', true);
    child.setData('responsiveBaseX', child.x);
    child.setData('responsiveBaseY', child.y);
    child.setData('responsiveBaseWidth', baseWidth);
  });
}

export function refreshResponsiveLayout(scene, options = {}) {
  const { baseWidth = 960 } = options;
  const offsetX = (scene.scale.width - baseWidth) / 2;
  const height = scene.scale.height;
  const width = scene.scale.width;

  scene.children.list.forEach((child) => {
    if (!child) return;

    if (child.getData?.('responsiveBackground')) {
      refreshBackground(scene, child);
      return;
    }

    if (child.getData?.('fullScreenOverlay')) {
      child.setPosition(width / 2, height / 2);
      child.setSize?.(width, height);
      return;
    }

    if (!child.getData?.('responsiveBaseCaptured')) return;

    const childBaseWidth = child.getData('responsiveBaseWidth') ?? baseWidth;
    const childOffsetX = (scene.scale.width - childBaseWidth) / 2;
    child.setPosition(child.getData('responsiveBaseX') + childOffsetX, child.getData('responsiveBaseY'));
  });
}

export function refreshBackground(scene, background) {
  const textureKey = background.getData?.('responsiveTextureKey') ?? background.texture?.key ?? 'mist-bg-placeholder';
  const texture = scene.textures.get(textureKey);
  const source = texture?.getSourceImage?.();
  const width = scene.scale.width;
  const height = scene.scale.height;

  background.setPosition(width / 2, height / 2);

  if (!source?.width || !source?.height) return;

  const scaleX = width / source.width;
  const scaleY = height / source.height;
  background.setScale(Math.max(scaleX, scaleY));
}
