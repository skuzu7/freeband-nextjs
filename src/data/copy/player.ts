// src/data/copy/player.ts
// Every string the video player prints or announces. Its buttons are named
// after what a press does ("Reproduzir", then "Pausar"), so none of them
// carries a pressed state that could contradict the name.

export const player = {
  // The clip's title rides along: four players on a page would otherwise put
  // four buttons called "Reproduzir" in a screen reader's list.
  play: (title: string) => `Reproduzir: ${title}`,
  pause: (title: string) => `Pausar: ${title}`,
  seek: 'Linha do tempo',
  // The timeline's value as it is read out: "0:05 de 0:27".
  position: (current: string, total: string) => `${current} de ${total}`,
  mute: 'Desativar o som',
  unmute: 'Ativar o som',
  volume: 'Volume',
  volumeValue: (percent: number) => `${percent}%`,
  // Subtitles: the button exists only on a clip that has a track.
  captionsLabel: 'CC',
  captionsOn: 'Mostrar legendas',
  captionsOff: 'Ocultar legendas',
  fullscreen: 'Tela cheia',
  exitFullscreen: 'Sair da tela cheia',
  loading: 'Carregando o vídeo',
  error: 'Este vídeo não carregou.',
  errorCta: 'Peça o material pelo WhatsApp',
  // The keyboard, described once for whoever cannot see the controls.
  keys: 'Com o foco no player: espaço ou K reproduz e pausa, setas para os lados voltam e avançam 5 segundos, setas para cima e para baixo mudam o volume, M desativa o som, F abre a tela cheia.',
};
