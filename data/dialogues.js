export const DIALOGUES = {
  tutorialMove: [
    {
      speaker: 'Tutorial',
      text: 'Use A/D, setas ou os botões virtuais para mover Ren Kiro pela fase.',
      lockPlayer: false,
    },
  ],
  tutorialJump: [
    {
      speaker: 'Tutorial',
      text: 'Pressione Espaço, W ou PULO para saltar. Pressione novamente no ar para usar o pulo duplo.',
      lockPlayer: false,
    },
  ],
  tutorialDash: [
    {
      speaker: 'Tutorial',
      text: 'Use K ou DASH para atravessar pequenos perigos com velocidade. O dash tem recarga curta.',
      lockPlayer: false,
    },
  ],
  tutorialAttack: [
    {
      speaker: 'Tutorial',
      text: 'Use J ou ATQ para atacar. Acerte em sequência para completar o combo de três golpes.',
      lockPlayer: false,
    },
  ],
  tutorialSpecial: [
    {
      speaker: 'Tutorial',
      text: 'Use I ou ORB para lançar o Orbe do Vento. Ele consome energia, então escolha bem o momento.',
      lockPlayer: false,
    },
  ],
  kaizenIntro: [
    {
      speaker: 'Kaizen',
      text: 'A névoa reconhece seus passos, Ren Kiro. Mas ela não abrirá caminho para você.',
      lockPlayer: true,
    },
    {
      speaker: 'Ren Kiro',
      text: 'Então eu corto a bruma até encontrar a saída.',
      lockPlayer: true,
    },
    {
      speaker: 'Kaizen',
      text: 'Venha. Aprenda o peso de desafiar o Guardião da Névoa.',
      lockPlayer: true,
    },
  ],
  kaizenDefeated: [
    {
      speaker: 'Kaizen',
      text: 'A Bruma Clara ainda vive em você... talvez o caminho não esteja perdido.',
      lockPlayer: true,
    },
    {
      speaker: 'Ren Kiro',
      text: 'Eu vou seguir. Cada sombra ainda pode revelar uma passagem.',
      lockPlayer: true,
    },
  ],
};

export function getDialogue(dialogueId) {
  return DIALOGUES[dialogueId] ?? [];
}
