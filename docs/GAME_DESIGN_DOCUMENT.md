# Game Design Document, Kage no Kiro

## 1. Visão geral

**Nome do jogo:** Kage no Kiro

**Gênero:** ação 2D, plataforma, aventura ninja e progressão por fases

**Plataforma inicial:** web, executando diretamente no navegador

**Plataforma futura:** Android, com possibilidade de empacotamento para APK/AAB e publicação na Google Play Store

**Modelo inicial:** jogo gratuito em versão MVP, com expansão futura para progressão, cosméticos e missões diárias

**Objetivo do projeto:** criar um jogo 2D simples, original e divertido, inspirado na sensação de animes de ninjas, mas sem usar nomes, personagens, símbolos, músicas, poderes, clãs ou elementos protegidos por copyright de obras existentes.

---

## 2. Conceito principal

Kage no Kiro é um jogo de ação ninja 2D em que o jogador controla um jovem guerreiro das sombras que precisa proteger seu vale contra clãs corrompidos por uma energia antiga chamada **Névoa Vazia**.

O foco do jogo é ser rápido, acessível e viciante, com fases curtas, movimentação ágil, ataques simples, esquivas, poderes originais e evolução gradual do personagem.

A experiência desejada é fazer o jogador sentir que está evoluindo como um ninja, desbloqueando novas técnicas, vencendo inimigos mais difíceis e enfrentando chefes com padrões próprios.

---

## 3. Público-alvo

O jogo é pensado para:

- jogadores adolescentes e jovens adultos;
- fãs de ação 2D e jogos de plataforma;
- pessoas que gostam de estética ninja e fantasia oriental original;
- jogadores mobile casuais no futuro;
- usuários que procuram partidas rápidas, fases curtas e evolução constante.

A classificação indicativa desejada deve ser leve, evitando violência gráfica, sangue ou conteúdo pesado. O combate deve ser estilizado, com efeitos visuais, impactos e desaparecimento dos inimigos ao serem derrotados.

---

## 4. História base

O mundo de Kage no Kiro se passa no arquipélago fictício de **Ayorin**, uma terra dividida por vales, florestas densas, montanhas suspensas e vilarejos ocultos.

Durante muitos anos, os clãs de Ayorin protegiam os **Selos do Equilíbrio**, artefatos responsáveis por manter afastada uma força espiritual instável conhecida como **Névoa Vazia**.

Quando um antigo selo é quebrado, parte dos clãs começa a ser corrompida. Guerreiros antes honrados passam a obedecer uma entidade misteriosa chamada **O Vulto Sem Rosto**.

O protagonista, um aprendiz do pequeno Clã Kiro, sobrevive a um ataque contra seu vilarejo e parte em uma jornada para recuperar os fragmentos dos selos, libertar guerreiros corrompidos e impedir que a Névoa Vazia cubra todo o arquipélago.

---

## 5. Personagem principal

**Nome:** Ren Kiro

**Idade sugerida:** jovem aprendiz, sem idade exata definida dentro do jogo

**Clã:** Clã Kiro

**Função:** protagonista jogável

**Personalidade:** determinado, impulsivo, protetor e curioso

**Motivação:** proteger os sobreviventes de seu vilarejo e descobrir por que a Névoa Vazia voltou a se espalhar

**Arma principal:** lâmina curta chamada **Katsume**, uma arma leve usada para ataques rápidos

**Habilidade inicial:** avanço veloz chamado **Passo de Bruma**, que permite uma esquiva curta para frente ou para trás

Ren não deve ser escrito como cópia de nenhum personagem famoso. Ele precisa ter visual, personalidade, história, símbolos, cores e poderes próprios.

---

## 6. Vilões principais

### O Vulto Sem Rosto

Entidade central da história. Não possui forma fixa e aparece como uma silhueta coberta por névoa escura. Seu objetivo é romper todos os Selos do Equilíbrio para transformar Ayorin em um território dominado pela Névoa Vazia.

### Kaoru Venn

Ex-líder de patrulha do Clã Venn. Foi corrompido pela Névoa Vazia e se tornou o primeiro chefe importante do jogo. Usa lâminas duplas e ataques rápidos em sequência.

### Myra Sazan

Estrategista do Clã Sazan. Age como antagonista recorrente e usa ilusões sonoras, armadilhas e clones de névoa, sempre com mecânicas originais.

### Doro Ashin

Guerreiro bruto do Clã Ashin. Controla pedras energizadas pela Névoa Vazia e atua como chefe de uma fase de montanha.

### Enko Raimei

Caçador mascarado que serve diretamente ao Vulto Sem Rosto. Usa correntes, saltos longos e ataques elétricos fictícios chamados **Riscos de Âmbar**.

---

## 7. Clãs originais

### Clã Kiro

Clã do protagonista. Especializado em velocidade, leitura de terreno e técnicas de bruma clara. Seus membros usam símbolos circulares cortados por uma linha curva, sem lembrar símbolos de obras existentes.

### Clã Venn

Clã de duelistas. Focado em lâminas leves, contra-ataques e deslocamento lateral. Após a corrupção, muitos membros se tornam inimigos comuns.

### Clã Sazan

Clã de estrategistas e criadores de armadilhas. Usa sinos, placas de pressão, fios de energia e ilusões visuais próprias.

### Clã Ashin

Clã resistente das montanhas. Usa armaduras leves de pedra polida, golpes fortes e defesa alta.

### Clã Lumae

Clã de curandeiros e guardiões de selos. Pode aparecer como aliado no futuro, oferecendo melhorias, missões e orientação.

---

## 8. Poderes originais

Os poderes do jogo devem ter nomes e funcionamento próprios, sem copiar técnicas famosas de outras franquias.

### Passo de Bruma

Esquiva curta que deixa um rastro translúcido. Serve para escapar de ataques e atravessar pequenos espaços perigosos.

### Corte Lunar

Ataque horizontal de curto alcance com efeito de arco luminoso. Técnica básica de combate.

### Pulso de Selo

O personagem libera uma onda curta de energia que empurra inimigos próximos. Deve ter tempo de recarga.

### Fio de Vento

Projétil rápido e fino que atinge inimigos à distância. Útil contra inimigos voadores ou arqueiros.

### Marca do Equilíbrio

Habilidade especial que causa dano extra em inimigos corrompidos por alguns segundos.

### Bruma Clara

Técnica defensiva temporária que reduz o dano recebido ou permite atravessar um ataque simples.

---

## 9. Loop principal de gameplay

1. O jogador escolhe uma fase no mapa.
2. Entra em uma fase curta 2D.
3. Corre, pula, ataca, esquiva e derrota inimigos.
4. Coleta fragmentos, moedas espirituais e itens.
5. Enfrenta um desafio final ou mini-chefe.
6. Recebe recompensa ao concluir a fase.
7. Usa recursos para melhorar habilidades.
8. Desbloqueia novas fases, missões e desafios.

O loop deve ser simples no MVP, mas preparado para receber novos modos no futuro.

---

## 10. Mecânicas principais

### Movimentação

- andar para esquerda e direita;
- pular;
- pulo duplo desbloqueável no futuro;
- esquiva curta;
- queda rápida opcional;
- plataformas móveis em fases avançadas.

### Combate

- ataque básico corpo a corpo;
- combo simples de três golpes;
- ataque à distância com recarga;
- habilidade especial;
- dano por contato com inimigos;
- barra de vida do jogador;
- barra de energia para poderes.

### Defesa

- esquiva com tempo de recarga;
- invulnerabilidade curta após receber dano;
- defesa especial desbloqueável futuramente.

### Coleta

- moedas espirituais;
- fragmentos de selo;
- itens de cura;
- pergaminhos de técnica;
- estrelas de conclusão da fase.

### Interface

- tela inicial;
- seleção de fases;
- HUD com vida, energia e habilidade;
- tela de vitória;
- tela de derrota;
- menu de melhorias.

---

## 11. Estilo visual

O visual deve ser 2D estilizado, com aparência própria e simples o bastante para produção inicial.

### Direção artística

- personagens em estilo chibi ou semi-chibi de ação;
- cenários com camadas em parallax;
- cores fortes, mas com atmosfera de mistério;
- efeitos de bruma, luz e cortes energéticos;
- animações simples e legíveis.

### Paleta inicial sugerida

- azul escuro para noite e sombra;
- ciano claro para Bruma Clara;
- roxo escuro para Névoa Vazia;
- dourado suave para Selos do Equilíbrio;
- verde escuro para florestas;
- cinza azulado para montanhas.

### Cuidados visuais

Não usar bandanas, símbolos circulares famosos, olhos especiais, roupas laranja icônicas, poses copiadas, animais ou emblemas reconhecíveis de franquias existentes.

---

## 12. Sistema de progressão

### Progressão do jogador

O jogador evolui Ren por meio de:

- aumento de vida máxima;
- redução de recarga da esquiva;
- aumento de dano do Corte Lunar;
- melhoria do Fio de Vento;
- desbloqueio de novas habilidades;
- aumento da energia máxima.

### Progressão de fases

Cada região possui fases comuns, uma fase de desafio e um chefe.

Exemplo:

- Região 1, Floresta de Nimbo
- Fase 1, Caminho dos Sussurros
- Fase 2, Ponte Partida
- Fase 3, Acampamento Corrompido
- Chefe, Kaoru Venn

### Sistema de estrelas

Cada fase pode entregar até três estrelas:

- concluir a fase;
- concluir com vida acima de determinada porcentagem;
- coletar todos os fragmentos.

---

## 13. Tipos de fases

### Fase de percurso

Fase simples com plataformas, inimigos básicos e coleta.

### Fase de combate

Área com ondas de inimigos. O jogador precisa sobreviver até derrotar todos.

### Fase de perseguição

A Névoa Vazia avança pela tela, forçando o jogador a correr.

### Fase de chefe

Combate contra inimigo especial com padrões de ataque.

### Fase de desafio diário futura

Fase curta com modificadores, como menos vida, mais inimigos ou tempo limitado.

---

## 14. Tipos de inimigos

### Sombra Venn

Inimigo básico com ataque corpo a corpo.

### Vigia Sazan

Inimigo que ataca à distância com pequenas lâminas de energia.

### Guardião Ashin

Inimigo lento, com vida alta e ataque pesado.

### Eco de Névoa

Criatura frágil que flutua e avança em direção ao jogador.

### Corredor Corrompido

Inimigo rápido que tenta alcançar o jogador e atacar em movimento.

### Sentinela de Selo

Inimigo especial que protege áreas importantes e pode ativar barreiras.

---

## 15. Chefes

### Chefe 1, Kaoru Venn

Primeiro chefe do MVP. Usa investidas, cortes duplos e salto para trás.

Padrões:

- investida horizontal;
- combo de duas lâminas;
- salto com ataque descendente;
- pausa curta após errar uma investida.

### Chefe 2, Myra Sazan

Chefe futura com armadilhas e ilusões.

Padrões:

- invoca sinos explosivos;
- cria cópias falsas;
- lança ondas sonoras;
- muda de posição rapidamente.

### Chefe 3, Doro Ashin

Chefe resistente de montanha.

Padrões:

- soco no chão;
- queda de pedras;
- escudo temporário;
- avanço pesado.

### Chefe final futuro, O Vulto Sem Rosto

Chefe dividido em fases, usando névoa, teleporte curto e ataques de área.

---

## 16. Recompensas

### Recompensas iniciais

- moedas espirituais;
- fragmentos de selo;
- estrelas de fase;
- desbloqueio de fase seguinte.

### Recompensas futuras

- roupas cosméticas originais;
- variações de lâmina;
- efeitos visuais para habilidades;
- títulos de jogador;
- itens de personalização sem vantagem injusta.

---

## 17. Missões diárias

As missões diárias devem ser simples e reaproveitar o conteúdo existente.

Exemplos:

- concluir 3 fases;
- derrotar 25 inimigos;
- coletar 50 moedas espirituais;
- vencer uma fase sem usar item de cura;
- derrotar 5 Guardiões Ashin;
- concluir uma fase em menos de determinado tempo.

Recompensas possíveis:

- moedas espirituais;
- fragmentos extras;
- pontos de missão;
- cosméticos futuros.

No MVP, as missões diárias podem ser simuladas localmente. No futuro, podem usar backend para evitar manipulação de data e recompensas.

---

## 18. Monetização futura

A monetização deve ser planejada apenas para versões futuras, sem atrapalhar o MVP.

### Possibilidades

- anúncios recompensados opcionais;
- passe de missões cosmético;
- skins originais;
- efeitos visuais de habilidades;
- remoção de anúncios;
- pacotes de moedas com limite ético.

### Regras de monetização

- não vender poder obrigatório para avançar;
- evitar pay-to-win;
- manter o jogo justo para jogadores gratuitos;
- anúncios sempre opcionais quando possível;
- compras apenas com itens originais.

---

## 19. Cuidados legais para não copiar Naruto ou outras obras

Este projeto deve ser totalmente original. Para reduzir riscos legais, seguir estas regras:

- não usar o nome Naruto;
- não usar nomes de personagens conhecidos;
- não usar clãs existentes de animes;
- não usar símbolos parecidos com emblemas famosos;
- não usar músicas, efeitos sonoros ou vozes de animes;
- não usar técnicas com nomes parecidos com técnicas famosas;
- não usar visual de personagens reconhecíveis;
- não usar olhos, marcas, roupas, cores ou acessórios que remetam diretamente a franquias específicas;
- não copiar mapas, vilas, organizações, hierarquias ou exames de obras existentes;
- não usar imagens geradas ou baixadas que reproduzam personagens protegidos;
- manter todos os nomes, poderes, clãs, vilões e elementos visuais originais.

A inspiração permitida deve ser apenas genérica: ninjas, fantasia, ação, treinamento, clãs fictícios e poderes espirituais originais.

---

## 20. Escopo do MVP inicial

O MVP deve ser pequeno, jogável e possível de começar rapidamente.

### MVP recomendado

**Objetivo:** criar uma primeira versão web jogável com uma fase, inimigos básicos e um chefe simples.

### Conteúdo do MVP

- tela inicial;
- personagem Ren Kiro jogável;
- movimentação lateral;
- pulo;
- ataque básico;
- esquiva Passo de Bruma;
- barra de vida;
- uma fase chamada Caminho dos Sussurros;
- cenário simples de floresta noturna;
- inimigo básico Sombra Venn;
- inimigo voador Eco de Névoa;
- moedas espirituais coletáveis;
- tela de vitória;
- tela de derrota;
- chefe simples Kaoru Venn;
- salvamento local de progresso no navegador.

### Fora do MVP

- multiplayer;
- loja completa;
- sistema online;
- ranking global;
- muitas fases;
- muitos personagens jogáveis;
- monetização real;
- publicação na Play Store.

Esses recursos devem ficar para versões futuras.

---

## 21. Roadmap sugerido

### Versão 0.1, Protótipo

- criar projeto web;
- implementar personagem;
- implementar movimentação;
- implementar ataque;
- criar uma fase de teste;
- adicionar um inimigo básico.

### Versão 0.2, MVP jogável

- adicionar HUD;
- adicionar vida e dano;
- adicionar moedas;
- adicionar vitória e derrota;
- melhorar fase inicial;
- adicionar primeiro chefe.

### Versão 0.3, Progressão

- adicionar menu de melhorias;
- salvar progresso local;
- adicionar estrelas de fase;
- adicionar segunda fase.

### Versão 0.4, Expansão visual

- melhorar sprites;
- adicionar parallax;
- adicionar efeitos de habilidades;
- melhorar tela inicial.

### Versão 0.5, Preparação mobile

- adaptar controles para toque;
- ajustar interface responsiva;
- testar em navegadores mobile;
- preparar possível empacotamento Android.

---

## 22. Tecnologias sugeridas

### Para web

- HTML5 Canvas;
- JavaScript ou TypeScript;
- Phaser 3 como engine 2D recomendada;
- Vite para ambiente de desenvolvimento;
- assets próprios ou temporários simples.

### Para futuro Android

- empacotamento com Capacitor;
- publicação como WebView otimizada;
- geração de AAB para Google Play Store;
- controles mobile nativos na interface.

---

## 23. Critérios de sucesso do MVP

O MVP será considerado funcional quando o jogador conseguir:

1. abrir o jogo no navegador;
2. iniciar a fase;
3. mover Ren Kiro;
4. pular e atacar;
5. derrotar inimigos;
6. receber dano;
7. coletar moedas;
8. enfrentar um chefe simples;
9. vencer ou perder;
10. reiniciar a partida.

---

## 24. Resumo executivo

Kage no Kiro deve começar como um jogo 2D web simples de ação ninja, com identidade própria, escopo pequeno e estrutura preparada para crescer. O projeto deve priorizar diversão rápida, controles bons, fases curtas, visual marcante e originalidade legal.

A primeira meta não é criar um jogo gigante, mas sim uma base jogável, bem organizada e fácil de expandir. Depois do MVP, o jogo pode receber novas fases, chefes, progressão, missões diárias, cosméticos e versão Android.