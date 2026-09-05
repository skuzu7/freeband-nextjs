// src/data/copy/arquivo.ts
// /arquivo — the poster archive with a category filter and a lightbox.
import type { PosterCategory } from '../media/posters';

export type FilterKey = 'todos' | PosterCategory;

export const arquivo = {
  seo: {
    title: 'O arquivo',
    description:
      'Cartazes de réveillons de prefeitura, bailes de clube e arraiás em que a Internacional Freeband tocou.',
  },
  label: 'O arquivo',
  headline: 'Cartazes de\nquem já tocou.',
  lead: 'Réveillon de praça, baile de clube, arraiá de sócio. Duas destas viradas foram contratadas por prefeitura municipal.',
  municipalNote: 'Realização da prefeitura',
  footnote: 'Um recorte do arquivo — a agenda completa vai por WhatsApp.',
  filterLabel: 'Filtrar por',
  filters: [
    { key: 'todos', label: 'Todos' },
    { key: 'municipal', label: 'Prefeituras' },
    { key: 'clube', label: 'Clubes' },
    { key: 'reveillon', label: 'Réveillons' },
  ] satisfies Array<{ key: FilterKey; label: string }>,
  lightbox: {
    open: 'Ampliar cartaz',
    close: 'Fechar',
    prev: 'Cartaz anterior',
    next: 'Próximo cartaz',
    counter: (index: number, total: number) => `${index} de ${total}`,
  },
};
