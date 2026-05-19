# Guia futuro de build Android com Capacitor

Este documento prepara o projeto **Kage no Kiro** para uma futura conversão de jogo web Phaser 3 para Android usando Capacitor.

A conversão ainda não deve ser feita agora. O objetivo desta etapa é deixar claro o caminho técnico, a estrutura esperada e os cuidados antes de gerar APK ou AAB.

## 1. Estado atual do projeto

O projeto atualmente funciona como jogo web estático com:

- `index.html`
- `style.css`
- `main.js`
- `scenes/`
- `entities/`
- `systems/`
- `data/`
- `assets/`
- `docs/`

Por enquanto, o jogo usa Phaser 3 via CDN no `index.html`. Isso é aceitável para testes web, mas para Android o ideal futuramente será usar uma estrutura de build local com npm, Vite ou ferramenta equivalente.

## 2. Estrutura recomendada para build web futura

Quando o projeto estiver pronto para empacotar, a estrutura recomendada será:

```text
AnimerDash/
  package.json
  index.html
  src/
    main.js
    scenes/
    entities/
    systems/
    data/
  public/
    assets/
  dist/
  android/
  docs/
```

Uma alternativa mais simples é manter a estrutura atual e apenas gerar a pasta `dist/`, mas a organização com `src/` e `public/` facilita manutenção, build e publicação.

### Estrutura mínima aceitável futuramente

```text
AnimerDash/
  package.json
  index.html
  main.js
  scenes/
  entities/
  systems/
  data/
  assets/
  dist/
  android/
```

## 3. Por que ainda não criar package.json agora

Neste momento o projeto ainda está em fase de protótipo e usa Phaser via CDN. Criar `package.json` agora poderia exigir ajustes no carregamento dos módulos, no servidor local e no fluxo de desenvolvimento.

Recomendação:

- manter o projeto web simples enquanto o gameplay ainda muda bastante;
- só migrar para npm/Vite quando o jogo estiver com fases, UI, áudio e assets mais estáveis;
- evitar mexer no gameplay apenas para preparar Android cedo demais.

## 4. Instalação futura do Capacitor

Quando o projeto estiver pronto para migrar para uma estrutura npm, os comandos esperados serão:

```bash
npm init -y
npm install phaser
npm install -D vite
npm install @capacitor/core @capacitor/cli
npx cap init
```

Durante o `npx cap init`, use dados semelhantes:

```text
App name: Kage no Kiro
App ID: com.erickgoncalves.kagenokiro
Web directory: dist
```

Depois instale a plataforma Android:

```bash
npm install @capacitor/android
npx cap add android
```

Depois de cada build web:

```bash
npm run build
npx cap copy android
npx cap sync android
```

Para abrir no Android Studio:

```bash
npx cap open android
```

## 5. Scripts esperados no package.json futuro

Quando o projeto for migrado para npm/Vite, o `package.json` poderá ter scripts parecidos com:

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0",
    "android:copy": "npm run build && npx cap copy android",
    "android:sync": "npm run build && npx cap sync android",
    "android:open": "npx cap open android"
  }
}
```

## 6. Configuração esperada de tela horizontal

O jogo foi pensado para jogar na horizontal. No Android, a orientação deve ser travada como landscape.

No Capacitor, isso geralmente será ajustado no projeto Android gerado, principalmente no `AndroidManifest.xml`, com orientação horizontal na Activity principal.

Exemplo conceitual:

```xml
android:screenOrientation="landscape"
```

Também será importante manter:

- tela cheia;
- área segura para notch;
- sem rotação acidental durante gameplay;
- botões virtuais ajustados para telas largas.

## 7. Ícone do app

Recomendações para o ícone:

- PNG de alta resolução;
- base quadrada;
- funcionar bem em tamanhos pequenos;
- sem texto pequeno;
- usar símbolo original do jogo, como uma bruma ciano abstrata ou selo espiritual original;
- evitar qualquer símbolo parecido com Naruto, vila, folha, clã famoso ou anime existente.

Tamanho de referência para arte fonte:

```text
1024x1024 px
```

Depois o Android Studio ou ferramentas de geração de ícones podem criar os tamanhos adaptativos.

## 8. Splash screen

Recomendações para a splash screen:

- fundo azul escuro ou quase preto;
- símbolo original do jogo em ciano/dourado;
- sem excesso de detalhes;
- sem texto pequeno;
- carregar rápido;
- manter a mesma identidade visual do guia de arte.

Tamanhos úteis para arte base:

```text
1920x1080 px
2732x2732 px para imagem adaptável, se necessário
```

## 9. Cuidados com localStorage no Android

O jogo usa `localStorage` para salvar progresso, configurações, missões e retenção.

No Capacitor, `localStorage` normalmente funciona dentro da WebView, mas existem cuidados:

- não limpar dados do app durante testes, senão o save será apagado;
- evitar salvar arquivos grandes no localStorage;
- salvar apenas dados pequenos, como XP, moedas, fases concluídas e preferências;
- no futuro, considerar Capacitor Preferences para saves mais robustos;
- criar opção de exportar/importar save caso o jogo cresça muito;
- testar se o save permanece após fechar e abrir o app.

### Possível evolução futura

Se o save crescer, migrar de `localStorage` para:

```text
@capacitor/preferences
```

Isso pode deixar o armazenamento mais adequado para app Android.

## 10. Cuidados com performance mobile

Antes de gerar APK ou AAB, revisar:

- peso dos spritesheets;
- quantidade de partículas;
- quantidade de inimigos simultâneos;
- uso de efeitos visuais com blend/add;
- tamanho dos backgrounds;
- animações muito grandes;
- chamadas frequentes ao localStorage dentro do gameplay;
- textos sendo atualizados todo frame sem necessidade;
- colisões em excesso;
- escala de canvas em aparelhos fracos.

Recomendações:

- usar spritesheets otimizados;
- comprimir PNGs;
- limitar partículas;
- manter fases curtas;
- testar em celular intermediário e fraco;
- manter o jogo em 960x540 interno com escala adaptável;
- evitar assets enormes em 4K.

## 11. Checklist antes de gerar APK ou AAB

Antes de empacotar para Android, confirmar:

- [ ] jogo abre sem erros no navegador;
- [ ] menu funciona;
- [ ] seleção de fases funciona;
- [ ] fases carregam por `data/levels.js`;
- [ ] player se move, pula, dá dash e ataca;
- [ ] botões mobile funcionam;
- [ ] pausa funciona;
- [ ] configurações são salvas;
- [ ] save continua após recarregar;
- [ ] missões diárias funcionam;
- [ ] progressão funciona;
- [ ] Kaizen funciona;
- [ ] tela de vitória funciona;
- [ ] tela de derrota funciona;
- [ ] assets finais estão otimizados;
- [ ] áudio está com volume configurável;
- [ ] tela horizontal está bem ajustada;
- [ ] não há textos ou imagens com elementos protegidos de Naruto ou outras franquias;
- [ ] ícone e splash screen são originais;
- [ ] política de privacidade estará pronta caso o app colete dados ou use anúncios no futuro.

## 12. Como testar no Android Studio futuramente

Fluxo futuro esperado:

```bash
npm run build
npx cap sync android
npx cap open android
```

No Android Studio:

1. aguardar o Gradle sincronizar;
2. escolher um emulador Android;
3. preferir emulador em landscape;
4. clicar em Run;
5. testar fluxo completo do jogo;
6. testar fechar e abrir o app;
7. testar se o save permanece;
8. testar toque simultâneo;
9. testar pausa ao sair do app;
10. testar desempenho em tela cheia.

## 13. Testes recomendados em aparelho real

No aparelho real:

- testar em Android recente;
- testar em aparelho intermediário;
- testar em aparelho com notch;
- testar em tela 16:9;
- testar em tela 19.5:9 ou 20:9;
- testar toques simultâneos;
- testar controle mobile com mãos reais;
- testar se os botões não cobrem o personagem;
- testar se o app não rotaciona para retrato durante a partida;
- testar se o save permanece depois de fechar o app.

## 14. O que ainda ficará para depois

Ainda ficará para uma etapa futura:

- criar `package.json`;
- migrar Phaser de CDN para dependência npm;
- configurar Vite;
- gerar pasta `dist/`;
- instalar Capacitor;
- adicionar plataforma Android;
- configurar ícone real;
- configurar splash screen real;
- travar orientação no Android;
- testar no Android Studio;
- gerar APK de teste;
- gerar AAB para Google Play;
- revisar requisitos da Google Play Store.

## 15. Comandos futuros resumidos

Quando chegar a hora:

```bash
npm init -y
npm install phaser
npm install -D vite
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor/android
npx cap add android
npm run build
npx cap sync android
npx cap open android
```

Depois, no Android Studio, será possível gerar:

```text
APK para teste local
AAB para envio à Google Play Store
```

## 16. Observação legal

Mesmo no Android, o jogo deve continuar evitando:

- nomes de Naruto;
- símbolos de vila;
- bandanas metálicas similares;
- olhos especiais famosos;
- roupas, poses ou poderes reconhecíveis de franquias existentes;
- músicas, vozes ou efeitos protegidos.

A identidade deve permanecer original, baseada em bruma, vento, ruínas, energia ciano, corrupção roxa e selos abstratos próprios.
