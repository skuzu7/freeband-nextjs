// @vitest-environment node
//
// The three sets the photo viewer walks. An id is the last segment of a URL
// people share, so it has to be unique, well-formed and stable; every item
// has to point at a registered file and say what it shows.
import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { eraPhotos, timeline } from '@/data/band';
import { arquivo } from '@/data/copy/arquivo';
import { palco } from '@/data/copy/palco';
import { estrutura } from '@/data/media/estrutura';
import { figurinos } from '@/data/media/figurinos';
import { stageFrames } from '@/data/media/frames';
import { GALLERY_KEYS, gallery } from '@/data/media/gallery';
import { images } from '@/data/media/paths';
import { posters } from '@/data/media/posters';
import { hrefFor, positionOf } from '@/lib/gallery/sets';

const registered = new Set<string>(Object.values(images));
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const fileSlug = (src: string) => path.basename(src, path.extname(src));

describe('gallery sets', () => {
  it('palco holds the 33 stage frames, then 3 figurinos, then 3 of the rig: 39', () => {
    const ids = gallery.palco.items.map((i) => i.id);
    expect(ids).toHaveLength(39);
    expect(ids).toEqual([...stageFrames, ...figurinos, ...estrutura].map((f) => f.id));
  });

  it('arquivo holds the 9 flyers, in the order of the archive', () => {
    const ids = gallery.arquivo.items.map((i) => i.id);
    expect(ids).toHaveLength(9);
    expect(ids).toEqual(posters.map((p) => p.id));
  });

  it('historia holds every photograph of the timeline, era by era, lead first', () => {
    const photos = timeline.flatMap(eraPhotos);
    expect(gallery.historia.items.map((i) => i.id)).toEqual(photos.map((p) => p.id));
    // 6 that open the eras and the 10 prints of the album.
    expect(photos).toHaveLength(16);
    for (const photo of photos) expect(photo.id, photo.src).toBe(fileSlug(photo.src));
  });

  it('a photograph of the timeline is placed by its era', () => {
    for (const era of timeline) {
      for (const photo of eraPhotos(era)) {
        const item = gallery.historia.items.find((i) => i.id === photo.id);
        expect(item?.caption).toBe(photo.caption);
        expect(item?.meta).toBe(`${era.year} · ${era.title}`);
      }
    }
  });

  it.each(GALLERY_KEYS)('%s — ids are unique slugs', (key) => {
    const ids = gallery[key].items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id, `"${id}" is not a slug`).toMatch(SLUG);
  });

  it.each(GALLERY_KEYS)('%s — every src is registered in paths.ts', (key) => {
    for (const item of gallery[key].items) {
      expect(registered.has(item.src), `${item.id} → ${item.src} is not in images`).toBe(true);
    }
  });

  it.each(GALLERY_KEYS)('%s — every item says what it shows, at its native size', (key) => {
    for (const item of gallery[key].items) {
      expect(item.alt, `${item.id} alt`).toBeTruthy();
      expect(item.caption, `${item.id} caption`).toBeTruthy();
      // "W/H" in native pixels: the viewer reads the zoom limit out of it.
      expect(item.aspect, `${item.id} aspect`).toMatch(/^[1-9]\d*\/[1-9]\d*$/);
    }
  });

  it('carries each source photograph through unchanged', () => {
    const sources = [...stageFrames, ...figurinos, ...estrutura, ...posters];
    const items = [...gallery.palco.items, ...gallery.arquivo.items];
    expect(items.map(({ src, alt, aspect }) => ({ src, alt, aspect }))).toEqual(
      sources.map(({ src, alt, aspect }) => ({ src, alt, aspect })),
    );
  });

  it('the ids added for the viewer are the slug of the file name', () => {
    for (const shot of [...figurinos, ...estrutura, ...posters]) {
      expect(shot.id, shot.src).toBe(fileSlug(shot.src));
    }
  });

  it('a stage frame is captioned by the frame and placed in its act', () => {
    const first = gallery.palco.items[0];
    expect(first.caption).toBe(stageFrames[0].caption);
    const act = palco.acts.find((a) => a.key === stageFrames[0].category);
    expect(first.meta).toBe(`${palco.actWord} ${act?.numeral} · ${act?.title}`);
    for (const item of gallery.palco.items) expect(item.meta, `${item.id} meta`).toBeTruthy();
  });

  it('a flyer is titled by town and event, with its facts and its promoter', () => {
    for (const poster of posters) {
      const item = gallery.arquivo.items.find((i) => i.id === poster.id);
      expect(item?.caption).toBe(`${poster.town} · ${poster.event}`);
      if (poster.venue) expect(item?.meta).toContain(poster.venue);
      expect(item?.note).toBe(poster.municipal ? arquivo.municipalNote : undefined);
      // "—" stands for a flyer that prints no date: it is not shown as one.
      expect(item?.meta ?? '').not.toContain('—');
    }
  });

  it('each set lives under its page and names its viewer', () => {
    expect(gallery.palco).toMatchObject({ key: 'palco', path: '/palco', segment: 'foto' });
    expect(gallery.arquivo).toMatchObject({ key: 'arquivo', path: '/arquivo', segment: 'cartaz' });
    expect(hrefFor(gallery.palco, gallery.palco.items[0].id)).toBe(`/palco/foto/${stageFrames[0].id}`);
    expect(hrefFor(gallery.arquivo, posters[0].id)).toBe(`/arquivo/cartaz/${posters[0].id}`);
    expect(gallery.historia).toMatchObject({ key: 'historia', path: '/historia', segment: 'foto' });
    expect(hrefFor(gallery.historia, timeline[0].lead[0].id)).toBe(`/historia/foto/${timeline[0].lead[0].id}`);
    for (const key of GALLERY_KEYS) {
      const { labels } = gallery[key];
      for (const [name, value] of Object.entries(labels)) {
        if (typeof value === 'string') expect(value, `${key}.${name}`).toBeTruthy();
      }
      expect(labels.counter(3, gallery[key].items.length)).toBe(`3 de ${gallery[key].items.length}`);
    }
  });

  it('the walk is circular: before the first comes the last', () => {
    for (const key of GALLERY_KEYS) {
      const { items } = gallery[key];
      expect(positionOf(gallery[key], items[0].id)?.prev.id).toBe(items[items.length - 1].id);
      expect(positionOf(gallery[key], items[items.length - 1].id)?.next.id).toBe(items[0].id);
    }
  });
});
