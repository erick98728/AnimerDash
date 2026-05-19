# Guia de importação de assets reais

Este documento explica como substituir gradualmente os placeholders visuais por sprites, tilesets, ícones e elementos de UI reais sem quebrar o protótipo atual.

## 1. Regra principal

Os placeholders continuam existindo. O jogo só usa assets reais quando `USE_REAL_ASSETS` estiver ativado em:

```text
data/assetsManifest.js
```

Por padrão:

```js
export const USE_REAL_ASSETS = false;
```

Enquanto estiver `false`, o jogo usa as formas placeholder atuais. Quando os arquivos PNG estiverem prontos e colocados nas pastas corretas, altere para:

```js
export const USE_REAL_ASSETS = true;
```

## 2. Onde colocar os arquivos

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

## 3. Nomes esperados

Os caminhos oficiais estão em:

```text
data/assetsManifest.js
```

Se quiser usar outro nome, altere o `path` no manifesto.

## 4. Spritesheets recomendados

### Ren Kiro

Arquivos esperados:

```text
ren_kiro_idle.png
ren_kiro_run.png
ren_kiro_jump.png
ren_kiro_fall.png
ren_kiro_dash.png
```

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

Arquivos esperados:

```text
weak_ninja.png
kunai_shooter.png
heavy_guardian.png
shadow_ninja.png
```

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

## 5. Tilesets

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

## 6. Ícones e UI

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

## 7. Como o fallback funciona

Cada entrada do manifesto tem:

```js
{
  key: 'ren-kiro-idle',
  path: 'assets/sprites/player/ren_kiro_idle.png',
  fallback: 'player-idle-placeholder'
}
```

O jogo tenta usar `ren-kiro-idle`. Se esse asset não tiver sido carregado, usa `player-idle-placeholder`.

## 8. Como testar sem todos os assets prontos

1. Deixe `USE_REAL_ASSETS = false` para continuar usando placeholders.
2. Coloque um único PNG real, por exemplo `ren_kiro_idle.png`.
3. Altere `USE_REAL_ASSETS = true`.
4. Rode o jogo.
5. Se o arquivo existir no caminho certo, ele será carregado.
6. Se algum asset faltar, o jogo ainda terá placeholders para evitar quebrar.

## 9. Cuidados importantes

- Não use símbolos, roupas ou marcas parecidas com Naruto.
- Não use bandanas metálicas de vila.
- Não use olhos especiais famosos de animes existentes.
- Mantenha silhuetas originais.
- Use nomes de arquivos simples, sem espaço e sem acento.
- Prefira `.png` transparente para personagens e UI.
- Otimize arquivos antes de usar no mobile.

## 10. Próximo passo futuro

Depois que os assets reais forem adicionados, uma etapa futura pode:

- ajustar hitboxes por personagem real;
- criar animações por estado com frames específicos;
- implementar tilemaps reais;
- substituir botões placeholder por imagens de UI;
- criar atlas/spritesheet único para otimizar performance.
