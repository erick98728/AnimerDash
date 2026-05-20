# Guia de importação de assets reais

Este documento explica como substituir gradualmente os placeholders visuais por sprites, tilesets, ícones e elementos de UI reais sem quebrar o protótipo atual.

## 1. Regra principal

Os placeholders continuam existindo. O jogo só tenta carregar assets reais quando a chave geral `USE_REAL_ASSETS` e pelo menos uma categoria específica estiverem ativadas em:

```text
data/assetsManifest.js
```

Por padrão:

```js
export const USE_REAL_ASSETS = false;

export const ASSET_LOAD_FLAGS = {
  useRealPlayerAssets: false,
  useRealEnemyAssets: false,
  useRealBossAssets: false,
  useRealCollectibleAssets: false,
  useRealBackgroundAssets: false,
  useRealTilesetAssets: false,
  useRealUiAssets: false,
};
```

Enquanto `USE_REAL_ASSETS` estiver `false`, o jogo usa apenas placeholders.

Quando `USE_REAL_ASSETS` estiver `true`, o jogo ainda só carrega as categorias marcadas como `true`. Isso evita erro quando apenas alguns PNGs estão prontos.

## 2. Como ativar apenas o Ren Kiro real

Coloque os arquivos do Ren Kiro em:

```text
assets/sprites/player/
```

Arquivos esperados:

```text
ren_kiro_idle.png
ren_kiro_run.png
ren_kiro_jump.png
ren_kiro_fall.png
ren_kiro_dash.png
```

Depois, em `data/assetsManifest.js`, use:

```js
export const USE_REAL_ASSETS = true;

export const ASSET_LOAD_FLAGS = {
  useRealPlayerAssets: true,
  useRealEnemyAssets: false,
  useRealBossAssets: false,
  useRealCollectibleAssets: false,
  useRealBackgroundAssets: false,
  useRealTilesetAssets: false,
  useRealUiAssets: false,
};
```

Assim o jogo só tenta carregar assets do jogador. Inimigos, boss, coletáveis, cenários e UI continuam em placeholder.

## 3. Como ativar apenas inimigos reais

Coloque os arquivos em:

```text
assets/sprites/enemies/
```

Arquivos esperados:

```text
weak_ninja.png
kunai_shooter.png
heavy_guardian.png
shadow_ninja.png
```

Depois use:

```js
export const USE_REAL_ASSETS = true;

export const ASSET_LOAD_FLAGS = {
  useRealPlayerAssets: false,
  useRealEnemyAssets: true,
  useRealBossAssets: false,
  useRealCollectibleAssets: false,
  useRealBackgroundAssets: false,
  useRealTilesetAssets: false,
  useRealUiAssets: false,
};
```

Importante: só ative essa categoria quando todos os PNGs esperados dos inimigos estiverem no caminho certo, ou ajuste os caminhos no manifesto.

## 4. Como voltar tudo para placeholder

Use:

```js
export const USE_REAL_ASSETS = false;
```

Ou mantenha a chave geral como `true`, mas desligue todas as categorias:

```js
export const ASSET_LOAD_FLAGS = {
  useRealPlayerAssets: false,
  useRealEnemyAssets: false,
  useRealBossAssets: false,
  useRealCollectibleAssets: false,
  useRealBackgroundAssets: false,
  useRealTilesetAssets: false,
  useRealUiAssets: false,
};
```

## 5. Onde colocar os arquivos

Use esta estrutura:

```text
assets/
  sprites/
    player/
      ren_kiro_idle.png
      ren_kiro_run.png
      ren_kiro_jump.png
      ren_kiro_fall.png
      ren_kiro_dash.png
    enemies/
      weak_ninja.png
      kunai_shooter.png
      heavy_guardian.png
      shadow_ninja.png
    bosses/
      kaizen.png
  tilesets/
    forest_tileset.png
    ninja_village_tileset.png
  backgrounds/
    mist_forest.png
    ninja_village.png
    boss_arena.png
  ui/
    buttons/
      button_base.png
    panels/
      panel_base.png
    icons/
      coin.png
      xp.png
      health.png
      energy.png
      shuriken.png
      wind_orb.png
```

## 6. Nomes esperados

Os caminhos oficiais estão em:

```text
data/assetsManifest.js
```

Se quiser usar outro nome, altere o `path` no manifesto.

## 7. Spritesheets recomendados

### Ren Kiro

Tamanho recomendado por frame:

```text
48x56 px
```

Cada PNG pode ser uma spritesheet horizontal, por exemplo:

```text
idle com 4 frames = 192x56 px
run com 6 frames = 288x56 px
jump com 1 frame = 48x56 px
```

### Inimigos

Tamanho recomendado por frame:

```text
48x56 px
```

### Kaizen

Arquivo esperado:

```text
kaizen.png
```

Tamanho recomendado por frame:

```text
60x72 px
```

## 8. Tilesets

Arquivos esperados:

```text
forest_tileset.png
ninja_village_tileset.png
```

Tamanho recomendado de tile:

```text
16x16 px
```

O jogo ainda usa plataformas simples, mas o manifesto já deixa os caminhos prontos para uma futura etapa de tilemap.

## 9. Ícones e UI

Arquivos esperados:

```text
coin.png
xp.png
health.png
energy.png
shuriken.png
wind_orb.png
button_base.png
panel_base.png
```

Recomendação:

```text
ícones: 32x32 px ou 64x64 px
botões: 180x48 px ou 300x64 px
painéis: 9-slice futuramente, por enquanto PNG simples
```

## 10. Como o fallback funciona

Cada entrada do manifesto tem:

```js
{
  key: 'ren-kiro-idle',
  path: 'assets/sprites/player/ren_kiro_idle.png',
  fallback: 'player-idle-placeholder'
}
```

O jogo tenta usar `ren-kiro-idle` apenas se a categoria do jogador estiver ativada e o arquivo tiver sido carregado. Se o asset real não estiver carregado, o código usa `player-idle-placeholder`.

## 11. Como testar asset por asset

1. Deixe `USE_REAL_ASSETS = false` e confirme que o jogo abre com placeholders.
2. Coloque apenas os PNGs de uma categoria, por exemplo `player`.
3. Ative `USE_REAL_ASSETS = true`.
4. Ative somente `useRealPlayerAssets = true`.
5. Rode o jogo.
6. Se funcionar, teste movimento, pulo, queda e dash.
7. Só depois ative outra categoria.

## 12. Como evitar erros enquanto os PNGs não existem

- Não ative uma categoria enquanto os arquivos esperados dela não estiverem prontos.
- Teste uma categoria por vez.
- Para continuar sem risco, mantenha `USE_REAL_ASSETS = false`.
- Se aparecer erro 404, desligue a categoria correspondente ou corrija o caminho do arquivo.

## 13. Cuidados importantes

- Não use símbolos, roupas ou marcas parecidas com Naruto.
- Não use bandanas metálicas de vila.
- Não use olhos especiais famosos de animes existentes.
- Mantenha silhuetas originais.
- Use nomes de arquivos simples, sem espaço e sem acento.
- Prefira `.png` transparente para personagens e UI.
- Otimize arquivos antes de usar no mobile.

## 14. Próximo passo futuro

Depois que os assets reais forem adicionados, uma etapa futura pode:

- ajustar hitboxes por personagem real;
- criar animações por estado com frames específicos;
- implementar tilemaps reais;
- substituir botões placeholder por imagens de UI;
- criar atlas/spritesheet único para otimizar performance.
