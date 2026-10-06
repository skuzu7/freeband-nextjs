// @vitest-environment node
//
// Walking a gallery set: positions, neighbours that wrap, and the addresses
// that follow from an id.
import { describe, expect, it } from 'vitest';
import type { GalleryItem, GallerySet, ViewerLabels } from '@/data/media/gallery';
import {
  anchorFor,
  backHrefFor,
  findItem,
  hrefFor,
  indexOfItem,
  linkFor,
  naturalSize,
  positionOf,
  transitionNameFor,
  viewerSizes,
  wrapIndex,
  zoomedSizes,
} from '../sets';

const labels: ViewerLabels = {
  title: 'Fotos',
  open: 'Ampliar foto',
  close: 'Fechar',
  back: 'Voltar',
  prev: 'Anterior',
  next: 'Próxima',
  counter: (index, total) => `${index} de ${total}`,
  zoomIn: 'Aproximar',
  zoomOut: 'Afastar',
  share: 'Compartilhar',
  copied: 'Link copiado',
  shareFailed: 'Copie o endereço',
  keys: 'Setas trocam de foto.',
};

const item = (id: string): GalleryItem => ({
  id,
  src: `/images/${id}.jpeg`,
  alt: `Foto ${id}`,
  aspect: '1200/800',
  caption: `Legenda ${id}`,
});

const set: GallerySet = {
  key: 'palco',
  path: '/palco',
  segment: 'foto',
  items: [item('um'), item('dois'), item('tres')],
  labels,
};

describe('position in the set', () => {
  it('finds a photograph by id', () => {
    expect(indexOfItem(set, 'dois')).toBe(1);
    expect(indexOfItem(set, 'nenhuma')).toBe(-1);
    expect(findItem(set, 'tres')?.caption).toBe('Legenda tres');
    expect(findItem(set, 'nenhuma')).toBeUndefined();
  });

  it('knows the neighbours, the first and the last', () => {
    const position = positionOf(set, 'dois');
    expect(position).toMatchObject({ index: 1, total: 3 });
    expect(position?.item.id).toBe('dois');
    expect(position?.prev.id).toBe('um');
    expect(position?.next.id).toBe('tres');
    expect(position?.first.id).toBe('um');
    expect(position?.last.id).toBe('tres');
  });

  it('wraps at both ends', () => {
    expect(positionOf(set, 'um')?.prev.id).toBe('tres');
    expect(positionOf(set, 'tres')?.next.id).toBe('um');
    expect(wrapIndex(-1, 3)).toBe(2);
    expect(wrapIndex(3, 3)).toBe(0);
    expect(wrapIndex(-7, 3)).toBe(2);
  });

  it('a set of one is its own neighbour', () => {
    const one = { items: [item('so')] };
    expect(positionOf(one, 'so')).toMatchObject({ index: 0, total: 1 });
    expect(positionOf(one, 'so')?.next.id).toBe('so');
    expect(positionOf(one, 'so')?.prev.id).toBe('so');
  });

  it('is null for an id the set does not hold', () => {
    expect(positionOf(set, 'nenhuma')).toBeNull();
  });
});

describe('addresses', () => {
  it('a photograph lives under its gallery page', () => {
    expect(hrefFor(set, 'dois')).toBe('/palco/foto/dois');
    expect(hrefFor({ path: '/arquivo', segment: 'cartaz' }, 'jau')).toBe('/arquivo/cartaz/jau');
  });

  it('the way back lands on its thumbnail', () => {
    expect(anchorFor(set, 'dois')).toBe('foto-dois');
    expect(backHrefFor(set, 'dois')).toBe('/palco#foto-dois');
  });

  it('thumbnail and viewer share one transition name, distinct per set', () => {
    expect(transitionNameFor(set, 'dois')).toBe('palco-dois');
    expect(transitionNameFor({ key: 'arquivo' }, 'dois')).toBe('arquivo-dois');
  });

  it('linkFor is everything a thumbnail needs', () => {
    expect(linkFor(set, 'tres')).toEqual({
      href: '/palco/foto/tres',
      anchor: 'foto-tres',
      name: 'palco-tres',
      label: 'Ampliar foto: Legenda tres',
    });
    expect(() => linkFor(set, 'nenhuma')).toThrow(/nenhuma/);
  });
});

describe('image sizes', () => {
  it('reads the native pixels out of the aspect', () => {
    expect(naturalSize('2560/1706')).toEqual({ width: 2560, height: 1706 });
  });

  it('a large file is bound by the height on a wide screen and by the width otherwise', () => {
    expect(viewerSizes('2560/1706')).toBe('(min-aspect-ratio: 2560/1706) calc((100vh - 11rem) * 1.5006), 100vw');
  });

  it('a small file is never asked for beyond its own width', () => {
    expect(viewerSizes('400/300')).toBe('(min-width: 400px) 400px, 100vw');
  });

  it('zooming asks for the magnified width, capped at the file', () => {
    expect(zoomedSizes('2560/1706', 1349.2)).toBe('1350px');
    expect(zoomedSizes('2560/1706', 4000)).toBe('2560px');
  });
});
