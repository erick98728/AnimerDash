# Checklist de estabilidade do protótipo

Este checklist deve ser usado antes de cada nova etapa grande do projeto **Kage no Kiro**.

O objetivo é evitar que novas funcionalidades sejam adicionadas em cima de bugs acumulados. Sempre que uma área crítica falhar, corrija antes de continuar adicionando sistemas novos.

## Como usar este checklist

Antes de cada nova etapa:

1. atualize o projeto local com `git pull`;
2. rode o jogo em servidor local;
3. teste os fluxos obrigatórios deste documento;
4. marque o que passou;
5. anote qualquer erro encontrado;
6. corrija bugs bloqueadores antes de continuar.

Comando sugerido para teste local:

```bash
python -m http.server 5500
```

Depois abra:

```text
http://localhost:5500
```

## Critérios de resultado

Use estes status:

```text
[ ] Não testado
[x] Passou
[!] Falhou, mas não bloqueia
[X] Falhou e bloqueia nova feature
```

## Bugs que devem bloquear novas features

Não continue adicionando sistemas novos se acontecer qualquer item abaixo:

- jogo não abre;
- erro vermelho no console que impede jogar;
- menu não troca de cena;
- fase não carrega;
- player não se move;
- player não consegue atacar;
- vitória não salva progresso;
- derrota quebra a cena;
- save é apagado sem intenção;
- progressão perde moedas, XP, upgrades ou fases concluídas;
- pausa impede o jogo de continuar;
- configurações travam a cena;
- mobile fica injogável;
- boss não finaliza a fase;
- diálogo impede vitória ou controle permanentemente.

---

# 1. Menu

- [ ] O jogo abre sem erro no console.
- [ ] `BootScene` carrega e envia para `MenuScene`.
- [ ] O título aparece corretamente.
- [ ] O botão de seleção de fases funciona.
- [ ] O botão de melhorias funciona.
- [ ] O botão de missões e recompensas funciona.
- [ ] O botão de configurações funciona.
- [ ] A música do menu inicia sem duplicar.
- [ ] Voltar de outras cenas para o menu não quebra áudio.

Bugs bloqueadores:

- menu não aparece;
- qualquer botão principal não funciona;
- áudio do menu duplica várias vezes.

---

# 2. Seleção de fases

- [ ] A `LevelSelectScene` abre pelo menu.
- [ ] A fase 1 aparece liberada em save novo.
- [ ] Fases bloqueadas aparecem como bloqueadas.
- [ ] Fases concluídas aparecem com status correto.
- [ ] A fase seguinte libera após concluir a anterior.
- [ ] A fase de chefe fica destacada visualmente.
- [ ] O botão de voltar ao menu funciona.
- [ ] Selecionar uma fase envia o `levelId` correto para `GameScene`.

Bugs bloqueadores:

- fase 1 bloqueada em save novo;
- fase selecionada abre fase errada;
- conclusão de fase não libera próxima fase.

---

# 3. Gameplay geral

- [ ] `GameScene` abre sem erro.
- [ ] O player nasce no ponto correto.
- [ ] A câmera segue o player.
- [ ] Plataformas aparecem.
- [ ] Colisão com plataformas funciona.
- [ ] Moedas aparecem.
- [ ] Inimigos aparecem.
- [ ] Ponto final aparece em fases normais.
- [ ] Chegar ao ponto final finaliza a fase quando os requisitos forem cumpridos.
- [ ] Cair ou morrer leva para `GameOverScene`.

Bugs bloqueadores:

- player cai infinitamente por falha de colisão;
- fase não tem saída;
- câmera não segue;
- erro de carregamento impede a fase.

---

# 4. Movimento do jogador

- [ ] Andar para esquerda funciona.
- [ ] Andar para direita funciona.
- [ ] Pulo funciona.
- [ ] Pulo duplo funciona.
- [ ] Dash funciona.
- [ ] Dash tem cooldown.
- [ ] Player não fica preso em dash.
- [ ] Animações placeholder continuam funcionando.
- [ ] Controles não ficam presos após pausa.
- [ ] Controles não ficam presos após diálogo.

Bugs bloqueadores:

- player não se move;
- player fica travado após dash;
- input fica preso permanentemente.

---

# 5. Combate

- [ ] Ataque básico funciona.
- [ ] Combo de 3 golpes funciona.
- [ ] Cada golpe usa seu próprio ganho de energia.
- [ ] Shuriken funciona.
- [ ] Orbe do Vento funciona.
- [ ] Energia é consumida corretamente.
- [ ] Energia regenera corretamente.
- [ ] Cooldowns impedem spam exagerado.
- [ ] Knockback funciona.
- [ ] Hitboxes somem corretamente.
- [ ] Efeitos visuais simples aparecem.

Bugs bloqueadores:

- ataque não causa dano;
- hitbox fica ativa para sempre;
- especial trava o jogo;
- energia fica negativa.

---

# 6. Inimigos

- [ ] Ninja Fraco anda em direção ao jogador.
- [ ] Ninja Fraco ataca de perto.
- [ ] Atirador de Kunai mantém distância.
- [ ] Atirador de Kunai dispara projétil.
- [ ] Guardião Pesado tem mais vida.
- [ ] Guardião Pesado anda mais devagar.
- [ ] Ninja Sombrio teleporta curta distância.
- [ ] Inimigos recebem dano.
- [ ] Inimigos piscam ao serem atingidos.
- [ ] Inimigos morrem com vida 0.
- [ ] Inimigos dropam moedas ou XP.

Bugs bloqueadores:

- inimigos não recebem dano;
- inimigos causam erro ao morrer;
- projéteis inimigos quebram a cena.

---

# 7. Boss Kaizen

- [ ] Fase do boss carrega.
- [ ] Barra de vida do boss aparece.
- [ ] Kaizen aparece na arena.
- [ ] Diálogo inicial aparece.
- [ ] Diálogo inicial não quebra controles.
- [ ] Kaizen tem 3 fases de comportamento.
- [ ] Ataque corpo a corpo funciona.
- [ ] Ataque à distância funciona.
- [ ] Ataque em área funciona.
- [ ] Invocação de inimigos funciona.
- [ ] Ao derrotar Kaizen, o diálogo final aparece.
- [ ] Após o diálogo final, a tela de vitória aparece.
- [ ] Recompensa especial é salva.
- [ ] Habilidade desbloqueada é salva.

Bugs bloqueadores:

- Kaizen não aparece;
- Kaizen derrotado não finaliza fase;
- diálogo final trava vitória;
- recompensa do boss não salva.

---

# 8. Vitória

- [ ] `VictoryScene` abre após concluir fase normal.
- [ ] `VictoryScene` abre após derrotar boss.
- [ ] Mostra moedas recebidas.
- [ ] Mostra XP recebido.
- [ ] Mostra item especial quando existir.
- [ ] Mostra habilidade desbloqueada quando existir.
- [ ] Botão jogar novamente funciona.
- [ ] Botão melhorias funciona.
- [ ] Botão menu principal funciona.
- [ ] Som de vitória toca uma vez.

Bugs bloqueadores:

- vitória não abre;
- botões da vitória não funcionam;
- recompensa não salva.

---

# 9. Derrota

- [ ] `GameOverScene` abre quando o jogador morre.
- [ ] Mostra moedas coletadas na tentativa.
- [ ] Botão tentar novamente funciona.
- [ ] Botão voltar ao menu funciona.
- [ ] Som de derrota toca uma vez.
- [ ] Música da fase para ao morrer.

Bugs bloqueadores:

- morte não troca de cena;
- reiniciar fase quebra;
- música continua duplicada após derrota.

---

# 10. Save

- [ ] Save novo é criado corretamente.
- [ ] Save antigo continua compatível.
- [ ] Números salvos como texto são normalizados.
- [ ] Arrays duplicados são limpos quando necessário.
- [ ] `completedLevels` é mantido.
- [ ] `unlockedSkills` é mantido.
- [ ] `specialItems` é mantido.
- [ ] Configurações são mantidas.
- [ ] Retenção é mantida.
- [ ] Reset manual de save funciona quando usado no console.

Bugs bloqueadores:

- save é apagado sozinho;
- save antigo perde nível, moedas ou upgrades;
- localStorage fica inválido e impede abrir o jogo.

---

# 11. Progressão

- [ ] XP aumenta ao completar fase.
- [ ] Moedas aumentam ao completar fase.
- [ ] Pergaminhos raros aumentam quando recompensa existir.
- [ ] Nível não diminui em save antigo.
- [ ] Subir de nível gera ponto de habilidade.
- [ ] Pontos de habilidade são salvos.
- [ ] Upgrades comprados alteram status derivados.
- [ ] Shuriken considera upgrade de dano.
- [ ] Dash considera upgrade de cooldown.
- [ ] Energia considera upgrade de energia.

Bugs bloqueadores:

- XP não salva;
- nível regride;
- pontos de habilidade somem;
- upgrade comprado não persiste.

---

# 12. Retenção

- [ ] Recompensa diária aparece.
- [ ] Baú diário aparece.
- [ ] Missões diárias aparecem.
- [ ] Conquistas aparecem.
- [ ] Coletar moedas atualiza missão.
- [ ] Derrotar inimigos atualiza missão.
- [ ] Usar especial atualiza missão.
- [ ] Completar fase atualiza missão.
- [ ] Derrotar boss atualiza missão.
- [ ] Recompensas de retenção não sobrescrevem progresso.
- [ ] Sequência de login é mantida.

Bugs bloqueadores:

- recompensa diária apaga moedas ou XP;
- missão resgatada infinitamente sem controle;
- abrir retenção quebra save.

---

# 13. Upgrades

- [ ] Tela de upgrades abre.
- [ ] Mostra moedas.
- [ ] Mostra pontos de habilidade.
- [ ] Mostra pergaminhos raros.
- [ ] Upgrade de vida funciona.
- [ ] Upgrade de dano funciona.
- [ ] Upgrade de energia funciona.
- [ ] Upgrade de dash funciona.
- [ ] Upgrade de shuriken funciona.
- [ ] Custos são descontados corretamente.
- [ ] Não permite comprar sem recursos.
- [ ] Upgrades persistem após recarregar.

Bugs bloqueadores:

- upgrade desconta recurso e não aplica;
- permite comprar sem recurso;
- upgrade some após recarregar.

---

# 14. Pausa

- [ ] ESC pausa no PC.
- [ ] Botão mobile de pausa funciona.
- [ ] Continuar retoma o jogo.
- [ ] Reiniciar fase funciona.
- [ ] Voltar ao menu funciona.
- [ ] Abrir configurações pela pausa funciona.
- [ ] Botões invisíveis não continuam interativos.
- [ ] Inputs touch são liberados ao pausar.
- [ ] Pausa automática por perda de foco funciona.
- [ ] Voltar ao jogo após perda de foco exige Continuar.

Bugs bloqueadores:

- pausa trava o jogo;
- continuar não retoma física;
- botão invisível clica sem aparecer;
- pausa e diálogo travam juntos.

---

# 15. Configurações

- [ ] Tela de configurações abre pelo menu.
- [ ] Tela de configurações abre pela pausa.
- [ ] Volume de música altera o som atual.
- [ ] Volume de efeitos altera efeitos novos.
- [ ] Mostrar/ocultar botões mobile funciona.
- [ ] Opacidade dos botões mobile funciona.
- [ ] Ocultar ajuda no mobile funciona.
- [ ] Configurações persistem após recarregar.
- [ ] Voltar fecha a cena corretamente.

Bugs bloqueadores:

- configurações travam cena;
- botão voltar não funciona;
- alterar botões mobile deixa input preso.

---

# 16. Mobile

- [ ] Layout fica em orientação horizontal.
- [ ] Aviso de orientação aparece no retrato.
- [ ] Não há zoom acidental.
- [ ] Não há scroll acidental.
- [ ] Botão esquerda funciona.
- [ ] Botão direita funciona.
- [ ] Botão pulo funciona.
- [ ] Botão dash funciona.
- [ ] Botão ataque funciona.
- [ ] Botão shuriken funciona.
- [ ] Botão especial funciona.
- [ ] Botão pausa funciona.
- [ ] Botões não cobrem demais o jogador.
- [ ] Área segura funciona em tela com notch.
- [ ] Ocultar botões mobile também desativa interação.

Bugs bloqueadores:

- mobile injogável;
- botões não respondem;
- input fica preso;
- navegador rola ou dá zoom durante jogo.

---

# 17. Áudio

- [ ] Música do menu toca.
- [ ] Música da fase toca.
- [ ] Música do boss toca.
- [ ] Música para ao trocar de cena.
- [ ] Música não duplica.
- [ ] Efeito de pulo toca.
- [ ] Efeito de dash toca.
- [ ] Efeito de ataque toca.
- [ ] Efeito de shuriken toca.
- [ ] Efeito do Orbe do Vento toca.
- [ ] Efeito de dano toca.
- [ ] Efeito de moeda toca.
- [ ] Efeito de XP toca.
- [ ] Efeito de vitória toca.
- [ ] Efeito de derrota toca.
- [ ] Volume de música respeita configuração.
- [ ] Volume de efeito respeita configuração.

Bugs bloqueadores:

- música duplica infinitamente;
- erro de áudio impede jogar;
- volume não respeita configuração.

---

# 18. Diálogos e tutorial

- [ ] Tutorial de movimento aparece no início da fase 1.
- [ ] Tutorial de pulo aparece no momento correto.
- [ ] Tutorial de ataque aparece no momento correto.
- [ ] Tutorial de dash aparece no momento correto.
- [ ] Tutorial do Orbe aparece no momento correto.
- [ ] Diálogo avança com clique.
- [ ] Diálogo avança com toque dentro da caixa.
- [ ] Diálogo avança com teclado.
- [ ] Tocar botão mobile não avança diálogo sem querer.
- [ ] Diálogo não avança por trás da pausa.
- [ ] Diálogo importante bloqueia o jogador.
- [ ] Diálogo importante pode bloquear gameplay.
- [ ] Diálogo final do Kaizen leva à vitória.
- [ ] Diálogos não repetem em sequência exagerada.

Bugs bloqueadores:

- diálogo impede movimento para sempre;
- diálogo trava vitória;
- pausa e diálogo travam juntos;
- toque mobile avança fala sem querer.

---

# 19. Assets reais

- [ ] `USE_REAL_ASSETS = false` mantém placeholders.
- [ ] Ativar apenas player real não carrega inimigos reais.
- [ ] Ativar apenas inimigos reais não carrega player real.
- [ ] Ativar apenas boss real não carrega outras categorias.
- [ ] Ativar apenas backgrounds reais não quebra fase.
- [ ] Ativar apenas UI real não quebra HUD.
- [ ] Fallback funciona quando categoria está desligada.
- [ ] Ren Kiro real aparece se sprites existirem.
- [ ] Inimigos reais aparecem se sprites existirem.
- [ ] Kaizen real aparece se sprite existir.
- [ ] Moeda e XP reais aparecem se ícones existirem.
- [ ] Background real aparece se imagem existir.
- [ ] HUD usa ícones reais se existirem.

Bugs bloqueadores:

- ativar uma categoria quebra o jogo todo;
- fallback não funciona;
- ausência de PNG impede jogar com placeholders.

---

# 20. Android futuro

- [ ] Jogo funciona bem em navegador mobile.
- [ ] Layout horizontal está aceitável.
- [ ] Botões virtuais estão jogáveis.
- [ ] Save funciona após fechar/reabrir navegador.
- [ ] Performance está aceitável em celular real.
- [ ] Assets estão otimizados.
- [ ] Áudio respeita interação do usuário.
- [ ] Nenhum elemento visual copia Naruto ou outra franquia.
- [ ] Documentação Android está atualizada.
- [ ] Checklist de APK/AAB foi revisado.

Bugs bloqueadores antes de Android:

- mobile com FPS muito baixo;
- controles ruins em tela real;
- save instável;
- assets pesados demais;
- orientação horizontal problemática.

---

# Testes obrigatórios antes de qualquer nova feature

Antes de criar uma nova feature grande, teste obrigatoriamente:

- [ ] abrir jogo;
- [ ] entrar no menu;
- [ ] abrir seleção de fases;
- [ ] iniciar fase 1;
- [ ] mover, pular e dar dash;
- [ ] atacar inimigo;
- [ ] coletar moeda;
- [ ] pausar e continuar;
- [ ] abrir configurações pela pausa;
- [ ] vencer fase;
- [ ] verificar se próxima fase liberou;
- [ ] morrer e reiniciar;
- [ ] voltar ao menu;
- [ ] abrir missões;
- [ ] abrir upgrades;
- [ ] testar no mobile ou em modo device toolbar;
- [ ] verificar console sem erro bloqueador.

# Testes obrigatórios antes de mexer em save

- [ ] testar com save novo;
- [ ] testar com save antigo simulado;
- [ ] testar conclusão de fase;
- [ ] testar compra de upgrade;
- [ ] testar missão diária;
- [ ] testar recompensa diária;
- [ ] testar reload da página;
- [ ] testar reset manual.

# Testes obrigatórios antes de mexer em assets

- [ ] testar com `USE_REAL_ASSETS = false`;
- [ ] testar uma categoria real por vez;
- [ ] testar fallback sem PNG real;
- [ ] testar fase normal;
- [ ] testar boss;
- [ ] verificar console para erro 404;
- [ ] testar mobile com os assets ligados.

# Testes obrigatórios antes de mexer em mobile

- [ ] testar Chrome DevTools em landscape;
- [ ] testar Chrome DevTools em portrait;
- [ ] testar celular real se possível;
- [ ] testar toque simultâneo;
- [ ] testar pausa mobile;
- [ ] testar ocultar botões;
- [ ] testar opacidade;
- [ ] testar sem zoom e sem scroll.

# Decisão final antes de continuar

Só avance para uma nova etapa se:

- [ ] nenhum bug bloqueador foi encontrado;
- [ ] save permanece estável;
- [ ] fase 1 é jogável do início ao fim;
- [ ] menu e seleção de fases funcionam;
- [ ] pausa e configurações funcionam;
- [ ] console não mostra erro crítico;
- [ ] os commits anteriores foram revisados.
