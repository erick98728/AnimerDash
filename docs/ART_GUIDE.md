# Guia de Arte de Kage no Kiro

Este documento define a direção visual do jogo 2D ninja original **Kage no Kiro**. O objetivo é criar uma identidade anime/pixel art moderna, sombria, bonita, legível e leve para web/mobile, sem copiar Naruto ou qualquer franquia existente.

## 1. Direção artística geral

**Kage no Kiro** deve parecer um jogo de ação ninja 2D com fantasia espiritual original. A estética central mistura:

- bruma ciano e vento espiritual para representar a **Bruma Clara**;
- névoa roxa/violeta para representar a **Névoa Vazia**;
- dourado para selos, recompensas e energia rara;
- azul escuro e cinza frio para noite, ruínas e sombras.

O visual deve ser sombrio, mas nunca confuso. Personagem, inimigos, projéteis, itens e interface precisam ser reconhecíveis mesmo em telas pequenas.

### Pilares visuais

1. **Silhuetas fortes:** cada personagem deve ser identificável apenas pelo formato.
2. **Poucas cores por asset:** pixel art com paleta controlada e sem excesso de tons.
3. **Contraste funcional:** o jogador e os perigos devem se destacar do cenário.
4. **Originalidade ninja:** evitar qualquer elemento que remeta diretamente a Naruto, Boruto ou outras franquias.
5. **Leveza técnica:** assets pequenos, reutilizáveis, spritesheets bem organizados e tilesets modulares.

## 2. Paleta de cores

| Uso | Cor | HEX | Observação |
| --- | --- | --- | --- |
| Fundo noturno principal | Azul quase preto | `#07111F` | Base de menus, céu e sombras profundas |
| Sombra azul | Azul escuro | `#10223A` | Camadas de fundo e ruínas |
| Plataforma/pedra fria | Azul acinzentado | `#18324A` | Plataformas, UI escura e blocos |
| Bruma Clara | Ciano vivo | `#7BE7FF` | Energia do jogador, vento e highlights |
| Bruma suave | Ciano claro | `#DFFAFF` | Brilhos e efeitos leves |
| Névoa Vazia | Roxo intenso | `#5D3FD3` | Corrupção, teleporte e aura inimiga |
| Sombra corrompida | Roxo profundo | `#32224F` | Ninja Sombrio e áreas perigosas |
| Selo espiritual | Dourado | `#FFD166` | Selos, moedas e recompensas |
| Chefe/ameaça | Rosa névoa | `#FF5C8A` | Kaizen e alertas de boss |
| Especial vento | Verde-ciano | `#9FFFD0` | Orbe do Vento e efeitos especiais |
| Vida/dano | Coral vermelho | `#FF6B6B` | Dano recebido e alertas críticos |
| Texto claro | Branco frio | `#F2FBFF` | UI e textos principais |
| Texto secundário | Cinza azulado | `#9BB6C8` | Descrições e informações menores |

### Regras de uso da paleta

- Ciano deve comunicar jogador, vento, energia limpa e segurança.
- Roxo deve comunicar corrupção, perigo espiritual e inimigos sombrios.
- Dourado deve ser usado com moderação para selos, moedas, pergaminhos e recompensas.
- Vermelho/coral deve aparecer apenas em dano, perigo forte ou aviso crítico.
- Cenários devem usar tons escuros e menos saturados para não competir com personagens.

## 3. Linguagem de formas

| Elemento | Forma dominante | Intenção |
| --- | --- | --- |
| Ren Kiro | linhas diagonais, faixa fluida, corpo fino | agilidade, vento, velocidade |
| Bruma Clara | curvas, espirais abstratas, arcos leves | movimento natural e energia limpa |
| Névoa Vazia | pontas quebradas, manchas irregulares, fumaça angular | corrupção e instabilidade |
| Ninja Fraco | formas simples e pequenas | inimigo básico |
| Atirador de Kunai | triângulos, braço estendido, silhueta fina | ataque à distância |
| Guardião Pesado | blocos, ombros largos, quadrados | resistência e peso |
| Ninja Sombrio | pontas finas, rastro, forma inclinada | velocidade e teleporte |
| Kaizen | silhueta alta, selo circular, manto amplo | chefe espiritual imponente |
| UI | retângulos arredondados, borda ciano, detalhes dourados | clareza e identidade |

## 4. Estilo dos personagens

### Ren Kiro

Ren Kiro é o protagonista. Ele deve parecer jovem, ágil e original.

Características visuais:

- roupa azul escura/navy com panos azul-acinzentados;
- cachecol ou faixa ciano com formato de vento;
- cabelo escuro bagunçado ou capuz simples;
- lâmina curta **Katsume** bem visível;
- bolsa pequena de shuriken;
- detalhes ciano de Bruma Clara;
- silhueta fina e dinâmica;
- postura de combate leve.

Evitar:

- bandana metálica;
- símbolo de vila;
- roupa laranja/preta icônica;
- olhos especiais famosos;
- roupas muito parecidas com personagens existentes.

## 5. Estilo dos inimigos

### Ninja Fraco

- pequeno e simples;
- capuz básico;
- lâmina curta;
- cores verde-cinza escuras;
- marcas roxas suaves de corrupção;
- deve parecer o inimigo mais fácil.

### Atirador de Kunai

- corpo magro;
- braço ou pose de arremesso;
- kunais visíveis;
- roupa azul índigo escura;
- detalhes âmbar para leitura rápida;
- silhueta triangular.

### Guardião Pesado

- corpo largo e pesado;
- armadura de pedra escura;
- ombros grandes;
- rachaduras ciano;
- sem machado gigante exagerado;
- pode usar punhos pesados, manoplas ou lâmina curta robusta.

### Ninja Sombrio

- corpo fino e agressivo;
- roxo escuro e preto;
- rastro de fumaça violeta;
- olhos como pontos simples, sem padrão famoso;
- deve parecer rápido e teleportador.

## 6. Estilo dos chefes

### Kaizen, o Guardião da Névoa

Kaizen deve ser muito maior e mais imponente que os inimigos comuns.

Características:

- manto escuro em camadas;
- armadura parcial de pedra;
- névoa ciano em volta;
- corrupção roxa crescendo nas fases;
- selo circular original no peito;
- detalhes dourados quebrados;
- silhueta alta e espiritual.

### Fases visuais

1. **Fase 1:** controlado, aura ciano, pouca corrupção.
2. **Fase 2:** mais rachaduras roxas, selo mais brilhante, névoa mais densa.
3. **Fase 3:** aura violeta intensa, bordas agressivas, aparência mais corrompida.

## 7. Estilo dos cenários

### Floresta sombria

- árvores escuras;
- raízes e pedras com musgo;
- névoa ciano em camadas;
- lanternas pequenas;
- selos quebrados;
- ruínas antigas ao fundo.

### Vila ninja original

- casas de madeira escura;
- telhados curvos próprios, sem parecer vila famosa de anime;
- pontes de corda;
- lanternas;
- caminhos de pedra;
- bambu e panos pendurados;
- símbolos abstratos originais de selo.

### Templo/arena da névoa

- colunas quebradas;
- piso de pedra azul-acinzentado;
- névoa ciano baixa;
- rachaduras roxas;
- círculo de selo no chão;
- fundo escuro com silhueta espiritual.

## 8. Estilo da interface

A interface deve ser pixel art limpa, com alto contraste e leitura rápida.

Elementos:

- barra de vida do jogador em coral/vermelho com moldura escura;
- barra de energia em ciano;
- barra do chefe em rosa/roxo com borda ciano;
- moedas em dourado;
- XP em azul/ciano;
- pergaminhos raros em dourado com selo ciano;
- botões escuros com borda ciano;
- painéis com fundo azul quase preto e detalhes de selo.

Regras:

- texto deve ser renderizado pelo jogo, não desenhado no asset;
- botões devem vir sem texto;
- ícones devem funcionar em 32x32;
- HUD não deve cobrir demais a ação.

## 9. Efeitos visuais dos poderes

### Combo corpo a corpo

- arcos brancos/cianos;
- 3 variações de corte;
- terceiro golpe mais largo e com rastro de bruma.

### Shuriken

- projétil pequeno prateado/dourado;
- rastro ciano curto;
- impacto com faísca dourada.

### Orbe do Vento

- esfera ciano/verde-claro;
- anéis curvos de vento;
- brilho leve;
- impacto circular com partículas simples.

### Dash

- rastro ciano em linhas diagonais;
- pequenas partículas de vento;
- não deve cobrir o personagem por muito tempo.

### Ninja Sombrio

- fumaça roxa em pixels;
- surgimento/desaparecimento rápido;
- brilho violeta curto.

### Kaizen

- Lâmina de Névoa: projétil roxo/ciano horizontal;
- Explosão Nebular: círculo marcado antes de explodir;
- Chamado da Bruma: névoa circular nos pés/mãos;
- transição de fase com aura expandindo.

## 10. Animações necessárias

### Ren Kiro

| Animação | Frames recomendados | Observação |
| --- | --- | --- |
| idle | 4 a 6 | respiração leve e cachecol mexendo |
| run | 6 a 8 | movimento rápido e legível |
| jump | 2 a 4 | subida |
| double jump | 4 | giro/vento curto |
| fall | 2 a 4 | queda controlada |
| dash | 3 a 5 | rastro ciano |
| ataque 1 | 4 a 5 | corte rápido |
| ataque 2 | 4 a 5 | corte cruzado |
| ataque 3 | 5 a 6 | golpe mais forte |
| shuriken | 4 | arremesso |
| Orbe do Vento | 6 | carga e lançamento |
| hit | 2 a 3 | piscar/dano |
| death | 6 a 8 | queda simples |
| victory | 4 a 6 | pose curta |

### Inimigos

Para cada inimigo comum:

- idle: 3 a 5 frames;
- walk/run: 4 a 8 frames;
- attack: 4 a 6 frames;
- hit: 2 frames;
- death: 5 a 8 frames.

Animações extras:

- Atirador de Kunai: throwing;
- Ninja Sombrio: teleport;
- Guardião Pesado: heavy attack;
- Ninja Fraco: simple slash.

### Kaizen

- idle: 6 frames;
- walk: 6 frames;
- melee attack: 6 a 8 frames;
- ranged attack: 6 frames;
- area charge: 8 frames;
- area explosion: efeito separado;
- summon: 8 frames;
- phase 2 transition: 8 a 10 frames;
- phase 3 transition: 8 a 10 frames;
- hit: 2 frames;
- death: 10 a 14 frames.

## 11. Tamanhos recomendados

| Asset | Tamanho recomendado | Observação |
| --- | --- | --- |
| Tile base | 16x16 ou 32x32 | usar 32x32 se quiser mais detalhe |
| Ren Kiro | 64x64 ou 96x96 | 64 para gameplay leve, 96 para mais detalhe |
| Ninja Fraco | 48x48 | menor que Ren |
| Atirador de Kunai | 48x48 | magro e legível |
| Guardião Pesado | 64x64 | corpo largo |
| Ninja Sombrio | 48x48 | fino e rápido |
| Kaizen | 128x128 | chefe grande |
| Projéteis | 16x16 a 32x32 | shuriken menor, orbe maior |
| Ícones | 32x32 | HUD e menus |
| Botões | 128x32 ou 192x48 | sem texto dentro |
| Background | 960x540 ou maior | proporção 16:9 |
| Concept sheet | 1536x1152 | 4:3 |

## 12. Formato dos arquivos

- PNG transparente para sprites, ícones, efeitos e botões.
- PNG sem transparência para backgrounds.
- Spritesheets em PNG com frames alinhados.
- Atlas PNG + JSON quando houver muitos sprites.
- Arquivos editáveis em Aseprite `.aseprite` sempre que possível.
- Nomes em minúsculo, sem acento e sem espaço.

Exemplos:

- `ren_kiro_idle.png`
- `ren_kiro_run.png`
- `enemy_weak_ninja_walk.png`
- `boss_kaizen_phase_1.png`
- `tileset_forest_32x32.png`
- `icon_wind_orb.png`
- `ui_button_primary.png`

## 13. Organização da pasta assets

```text
assets/
  sprites/
    player/
      ren_kiro_idle.png
      ren_kiro_run.png
      ren_kiro_jump.png
      ren_kiro_dash.png
      ren_kiro_attack_combo.png
    enemies/
      weak_ninja/
      kunai_shooter/
      heavy_guardian/
      shadow_ninja/
    bosses/
      kaizen/
  tilesets/
    forest/
      tileset_forest_32x32.png
    village/
      tileset_village_32x32.png
  backgrounds/
    forest_parallax_01.png
    village_parallax_01.png
    temple_arena_bg.png
    title_screen_bg.png
  ui/
    buttons/
      ui_button_primary.png
    icons/
      icon_dash.png
      icon_shuriken.png
      icon_wind_orb.png
      icon_coin.png
      icon_xp.png
      icon_rare_scroll.png
  effects/
    wind_orb/
    dash/
    slash/
    mist/
  audio/
  fonts/
```

## 14. Regras legais e criativas

Evitar completamente:

- Naruto, Boruto ou referências diretas;
- bandanas metálicas;
- símbolos de vila;
- símbolo de folha;
- olhos especiais famosos;
- roupas laranja/preto icônicas;
- mantos com padrão parecido com grupos famosos;
- nomes de técnicas existentes;
- poses ou silhuetas reconhecíveis de personagens famosos;
- músicas, vozes ou efeitos de animes.

A identidade do jogo deve ser baseada em:

- vento;
- bruma;
- selos espirituais abstratos;
- sombras;
- ruínas;
- corrupção roxa;
- ciano como energia limpa.

## 15. Prompts para geração de arte

### 15.1 Concept sheet geral

```text
Create a clean visual identity concept sheet for an original 2D ninja action game called Kage no Kiro.

Use a 4:3 horizontal composition, recommended output size 1536x1152 px or higher. The image must show the overall art direction only, with no text or labels.

Center: Ren Kiro, original young ninja hero, agile stance, dark navy outfit, teal/cyan wind mist accents, short blade Katsume, small shuriken pouch, flowing cloth scarf shaped like wind.

Left side: Ninja Fraco, small weak ninja enemy, simple hood, short blade, dark green-gray palette, subtle purple corruption.

Upper left or mid left: Atirador de Kunai, slim ranged enemy, visible throwing knives, amber accents, sharp triangular silhouette.

Lower left: Guardião Pesado, bulky heavy enemy, stone armor, broad shoulders, gray-brown palette, cyan cracks, no oversized fantasy axe.

Right side: Ninja Sombrio, thin fast teleporting enemy, black and violet palette, smoky purple pixel trail, aggressive silhouette.

Background: Kaizen, the Mist Guardian, huge boss silhouette behind everyone, dark robe and armor, teal mist aura, violet corrupted fog, original circular spiritual seal on chest, no readable text.

Environment: dark mist forest, ancient temple ruins, teal fog, violet corruption, gold spiritual seal fragments.

Style: modern anime pixel art concept art, 2D game visual development, dark but readable, beautiful, clean shapes, strong silhouettes, limited color palette, teal/cyan for clear mist and wind, violet/purple for corruption, gold for seals, navy and blue-gray shadows.

IMPORTANT RULES: No text, no letters, no captions, no labels, no logos, no watermark. Original ninja fantasy design only. Do not copy Naruto, Boruto, Hidden Leaf symbols, forehead protectors, metal headbands, orange ninja outfits, sharingan-like eyes, rinnegan-like eyes, akatsuki-like cloaks, existing anime characters, copied emblems, copied poses or recognizable franchise elements.
```

### 15.2 Ren Kiro

```text
Create a clean character design sheet for Ren Kiro, based on the approved visual direction from the Kage no Kiro concept sheet.

Use a 4:3 horizontal composition, recommended output size 1536x1152 px or higher. This is a concept sheet, not the final in-game spritesheet. Each pose must be designed to remain readable when later reduced to 64x64 or 96x96 pixels.

Show only Ren Kiro. No other characters. Use a plain neutral background or transparent-looking background.

Create multiple clean production poses: front view, side view, idle pose, run pose, jump pose, dash pose, short blade attack pose, shuriken throw pose.

Visual identity: dark navy outfit, blue-gray cloth pieces, teal/cyan wind scarf, cyan Bruma Clara energy, short blade Katsume, small shuriken pouch, messy dark hair, agile young ninja silhouette, modern anime pixel art style, dark but readable mood.

Design goals: make the silhouette cleaner, make the short blade Katsume clearly visible, make the teal wind scarf iconic, make the outfit easy to animate, keep simple shapes and limited details, avoid excessive small accessories.

IMPORTANT RULES: No text, no letters, no captions, no labels, no logos, no watermark. No extra characters. No complex background. No metal forehead protector. No village symbol. No famous anime eye pattern. Do not copy Naruto or any existing anime franchise.
```

### 15.3 Ninja Fraco

```text
Create the Ninja Fraco enemy for Kage no Kiro.

Asset type: basic melee enemy for a 2D side-scroller pixel art game. Show only one enemy. Recommended sprite reference size: readable at 32x32 or 48x48 px.

Visual design: small weak ninja enemy, slim body, simple hood, short blade, dark green-gray outfit, muted cloth wraps, subtle violet corruption marks, slightly hunched posture, simple readable silhouette, clearly weaker than the main hero, no armor, no flashy powers.

Poses: idle pose, walk pose, melee attack pose, hit pose.

Style: modern anime pixel art, transparent or plain neutral background, no text, no logos, original design only.

Avoid Naruto, Boruto, forehead protectors, metal headbands, famous anime eyes, copied symbols or recognizable franchise elements.
```

### 15.4 Atirador de Kunai

```text
Create the Atirador de Kunai enemy for Kage no Kiro.

Asset type: ranged enemy for a 2D side-scroller pixel art game. Show only one enemy. Recommended sprite reference size: readable at 48x48 px.

Visual design: slim ranged ninja enemy, dark indigo outfit, amber/yellow accents, visible kunai in one hand, small belt with throwing knives, light armor, sharp triangular silhouette, focused posture, one arm extended preparing to throw.

Poses: idle pose, aiming pose, throwing kunai pose, hit pose.

Style: modern anime pixel art, transparent or plain neutral background, no text, no logos, original design only.

Avoid Naruto, Boruto, forehead protectors, metal headbands, famous anime eyes, copied symbols or recognizable franchise elements.
```

### 15.5 Guardião Pesado

```text
Create the Guardião Pesado enemy for Kage no Kiro.

Asset type: heavy tank enemy for a 2D side-scroller pixel art game. Show only one enemy. Recommended sprite reference size: readable at 64x64 px.

Visual design: large bulky guardian warrior, slow and powerful, stone-like armor, broad shoulders, thick arms, heavy stance, gray and dark brown palette, subtle cyan cracks glowing through armor, square and blocky shape language, intimidating but not too detailed.

Do not use a giant axe. Use heavy fists, stone gauntlets, short heavy blade or blunt arm guards instead.

Poses: idle pose, slow walk pose, heavy attack pose, hit pose.

Style: modern anime pixel art, transparent or plain neutral background, no text, no logos, original design only.

Avoid Naruto, Boruto, forehead protectors, metal headbands, famous anime eyes, copied symbols or recognizable franchise elements.
```

### 15.6 Ninja Sombrio

```text
Create the Ninja Sombrio enemy for Kage no Kiro.

Asset type: fast teleporting enemy for a 2D side-scroller pixel art game. Show only one enemy. Recommended sprite reference size: readable at 48x48 px.

Visual design: thin aggressive shadow ninja, black and deep violet outfit, smoky purple pixel trail, glowing violet eyes as simple dots only, no special anime eye pattern, sharp angular silhouette, crouched fast posture, corrupted mist aura.

Poses: idle pose, running pose, teleport pose, fast melee attack pose, hit pose.

Style: modern anime pixel art, transparent or plain neutral background, no text, no logos, original design only.

Avoid Naruto, Boruto, forehead protectors, metal headbands, famous anime eyes, copied symbols or recognizable franchise elements.
```

### 15.7 Kaizen

```text
Create Kaizen, the Mist Guardian, first boss of Kage no Kiro.

Asset type: boss character design sheet for a 2D side-scroller pixel art game. Show only Kaizen, with three phase variations. Recommended boss reference size: readable at 96x96 or 128x128 px.

Visual design: large imposing guardian corrupted by mystical mist, dark layered robes, partial stone armor, wide shoulders, powerful silhouette, teal/cyan clear mist, violet corrupted fog, gold broken seal ornaments, original circular spiritual seal on chest made of abstract geometric lines.

Phase 1: calm and controlled, less corruption, teal mist aura.
Phase 2: stronger violet mist, cracked armor, brighter chest seal.
Phase 3: intense corrupted aura, larger mist shapes, more aggressive silhouette, glowing purple edges.

Attack visual references: Corte da Névoa, Lâmina de Névoa, Explosão Nebular, Chamado da Bruma.

Style: modern anime pixel art boss concept, transparent or plain neutral background, no text, no logos, original design only.

Avoid Naruto, Boruto, forehead protectors, metal headbands, famous anime eyes, copied symbols or recognizable franchise elements.
```

### 15.8 Tileset de floresta

```text
Create a game-ready pixel art tileset for Kage no Kiro.

Asset type: modular forest tileset for a 2D side-scroller platformer. Use a clear 16x16 or 32x32 tile grid.

Theme: dark mist forest, teal/cyan fog, mossy ground, dark soil, roots, stones, tree trunks, bushes, hanging vines, small spiritual lanterns, broken seal stones, ancient forest ruins.

Tiles required: grass top tiles, dirt block tiles, left and right edge tiles, inside corner tiles, outside corner tiles, small platform tiles, mossy rock tiles, tree trunk pieces, roots, bushes, background tree silhouettes, decorative lanterns, small broken seal stones, fog overlay pieces.

Technical requirements: modular and tileable, clear pixel grid, side-scroller platformer perspective, limited color palette, readable for mobile, no characters, no text, no UI.
```

### 15.9 Tileset de vila ninja

```text
Create a game-ready pixel art tileset for an original ninja village in Kage no Kiro.

Asset type: modular village tileset for a 2D side-scroller platformer. Use a clear 16x16 or 32x32 tile grid.

Theme: original mountain mist village, dark wood houses, curved roof tiles, rope bridges, wooden platforms, stone paths, small paper lanterns, bamboo fences, hanging cloth, market props, mist details, abstract spiritual seal decorations.

Tiles required: wood floor tiles, wood wall tiles, roof tiles, roof edge tiles, stone path tiles, rope bridge tiles, wooden platform tiles, stairs or ladder pieces, lantern props, bamboo fence props, small house wall pieces, window props, door props, background building silhouettes, abstract original seal decoration.

Technical requirements: modular and tileable, side-scroller platformer perspective, limited palette, readable for mobile, no characters, no text, no UI.

Avoid Naruto, Hidden Leaf symbols, leaf emblems, copied anime village architecture or recognizable anime village references.
```

### 15.10 Ícones de habilidades

```text
Create a pixel art icon set for Kage no Kiro.

Asset type: UI icons for a 2D ninja action game. Create separate 32x32 icons on transparent background.

Icons required: dash with teal wind streak, silver shuriken, glowing cyan/teal wind orb, three diagonal slash combo, blue/cyan energy crystal, rare golden scroll with teal seal and no readable text, gold spiritual coin with abstract circle mark, blue XP shard, simple health icon, violet and gold mist mask boss reward.

Visual style: consistent dark outline, clean pixel art, readable at small size, limited palette, no text, no numbers, no letters, no logos.
```

### 15.11 Tela inicial

```text
Create a title screen background for Kage no Kiro.

Asset type: main menu background for a 2D ninja action game. Use 16:9 horizontal composition, recommended output size 1920x1080 px or 960x540 px.

Do not write the game title inside the image. Leave empty space for the title and menu buttons. No text at all.

Composition: dark mist forest at night, ancient temple gate in the background, teal/cyan fog, violet corrupted mist far away, golden broken seal fragments floating subtly, silhouette of Ren Kiro standing in foreground with short blade, distant huge vague silhouette of Kaizen behind fog.

Layout: empty space in upper center for title, empty space in lower center for buttons, not too busy, safe margins for mobile screen.

Style: modern anime pixel art background, dark beautiful atmosphere, teal mist, violet corruption, navy shadows, gold seal highlights, 2D game menu art.
```

### 15.12 Botão de interface

```text
Create a pixel art UI button set for Kage no Kiro.

Asset type: game interface button sprites. Create four button states in a horizontal spritesheet: normal, hover, pressed, disabled.

Technical requirements: 128x32 or 192x48 button sprites, transparent background, no text inside the button, all four states aligned in a horizontal spritesheet, consistent margins, clean edges.

Design: dark blue stone and dark wood frame, teal/cyan glowing border, subtle gold abstract seal detail in corners, blank center area for game text, clean rectangular shape with slightly rounded corners, readable on mobile.

Style: modern pixel art UI, dark fantasy ninja, teal glow, gold accent, simple and elegant.
```

## 16. Critérios de aprovação dos assets

Aprovar apenas se:

- não houver texto, logo ou marca d'água;
- não houver referência visual direta a Naruto ou franquias famosas;
- a silhueta estiver clara;
- o asset for legível em tamanho pequeno;
- a paleta seguir ciano, roxo, dourado e azul escuro;
- o fundo estiver transparente ou simples quando necessário;
- tilesets estiverem em grade modular;
- UI não tiver texto desenhado dentro.

Reprovar se:

- tiver texto falso;
- parecer personagem famoso;
- tiver símbolo de vila ou bandana metálica;
- for realista demais;
- não funcionar em tela pequena;
- estiver poluído visualmente;
- sprites ou tiles vierem fundidos e difíceis de recortar.
