// src/data/copy/arquivo.ts
// /arquivo — the poster archive with a category filter and the photo viewer.
import type { ViewerLabels } from '../media/gallery';
import type { PosterCategory } from '../media/posters';

export type FilterKey = 'todos' | PosterCategory;

export const arquivo = {
  seo: {
    title: 'O arquivo',
    description:
      'Cartazes de réveillons de prefeitura, bailes de clube e arraiás em que a Internacional Freeband tocou.',
    // The line under the title on the share card (opengraph-image.tsx).
    cardLine: 'Cartazes de réveillons, bailes de clube e arraiás em que a banda tocou.',
  },
  label: 'O arquivo',
  headline: 'Cartazes de\nquem já tocou.',
  lead: 'Acervo documental de grandes réveillons públicos, bailes tradicionais de clubes e eventos oficiais realizados com prefeituras municipais e diretorias em múltiplos estados.',
  municipalNote: 'Realização da prefeitura',
  footnote: 'Um recorte documental do nosso histórico de apresentações — referências e portfólio completo disponíveis sob consulta.',
  filterLabel: 'Filtrar por',
  filters: [
    { key: 'todos', label: 'Todos' },
    { key: 'municipal', label: 'Prefeituras' },
    { key: 'clube', label: 'Clubes' },
    { key: 'reveillon', label: 'Réveillons' },
  ] satisfies Array<{ key: FilterKey; label: string }>,
  // The viewer: one flyer at a time, over the archive or on its own page
  // (/arquivo/cartaz/<id>). It always walks all nine, whatever the filter.
  viewer: {
    title: 'Cartazes do arquivo',
    open: 'Ampliar cartaz',
    close: 'Fechar',
    back: 'Voltar ao arquivo',
    prev: 'Cartaz anterior',
    next: 'Próximo cartaz',
    counter: (index: number, total: number) => `${index} de ${total}`,
    zoomIn: 'Aproximar',
    zoomOut: 'Afastar',
    share: 'Compartilhar',
    copied: 'Link copiado',
    shareFailed: 'Copie o endereço da barra do navegador',
    keys: 'Setas trocam de cartaz, Home e End vão ao primeiro e ao último, mais e menos aproximam e afastam, zero ajusta à tela, Esc fecha.',
  } satisfies ViewerLabels,
};
