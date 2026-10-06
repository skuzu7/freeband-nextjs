// src/data/copy/system.ts
// The pages nobody asks for: the 404, the error boundary, and what a phone
// shows when the site is added to its home screen.
import { bandInfo, releaseShort } from '../band';

export const system = {
  notFound: {
    title: 'Página não encontrada',
    code: '404',
    label: 'Página não encontrada',
    headline: 'Esta página\nnão subiu ao palco.',
    lead: 'O endereço pode ter mudado ou nunca ter existido. O show continua nas páginas abaixo.',
    home: 'Voltar ao início',
  },
  error: {
    title: 'Erro ao carregar',
    label: 'Algo saiu do tom',
    headline: 'A página\nnão carregou.',
    lead: 'O erro foi nosso, não seu. Tente de novo; se continuar, fale com a produção pelo WhatsApp.',
    retry: 'Tentar de novo',
    home: 'Voltar ao início',
  },
  manifest: {
    name: bandInfo.name,
    shortName: 'Freeband',
    description: releaseShort,
  },
};
