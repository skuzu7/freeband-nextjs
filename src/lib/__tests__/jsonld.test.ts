// @vitest-environment node
//
// Structured data says only what the pages say, from the same modules.
import { describe, expect, it } from 'vitest';
import { bandInfo } from '@/data/band';
import { contact } from '@/data/contact';
import { gallery } from '@/data/media/gallery';
import { videos } from '@/data/media/videos';
import {
  absolute,
  breadcrumbs,
  galleryImages,
  imageGallery,
  isoDuration,
  musicGroup,
  serialise,
  videoObject,
  webSite,
} from '../seo/jsonld';

describe('absolute', () => {
  it('prefixes a path with the site and leaves a URL alone', () => {
    expect(absolute('/palco')).toBe(`${contact.siteUrl}/palco`);
    expect(absolute('images/a.jpeg')).toBe(`${contact.siteUrl}/images/a.jpeg`);
    expect(absolute('https://example.com/x')).toBe('https://example.com/x');
  });
});

describe('musicGroup', () => {
  const band = musicGroup('/opengraph-image');

  it('states the identity the site prints', () => {
    expect(band['@type']).toBe('MusicGroup');
    expect(band.name).toBe(bandInfo.name);
    expect(band.legalName).toBe(bandInfo.legalName);
    expect(band.foundingDate).toBe('1969');
    expect(band.founder.name).toBe(bandInfo.founder);
    expect(band.telephone).toBe(contact.phoneIntl);
    expect(band.sameAs).toEqual([contact.instagramUrl]);
    expect(band.image).toBe(`${contact.siteUrl}/opengraph-image`);
  });

  it('splits the city into locality and state instead of naming them twice', () => {
    expect(band.address.addressLocality).toBe('Trabiju');
    expect(band.address.addressRegion).toBe('SP');
    expect(band.address.streetAddress).toBe(contact.address);
  });

  it('leaves the image out when there is none', () => {
    expect(musicGroup()).not.toHaveProperty('image');
  });
});

describe('webSite', () => {
  it('points at the band as its publisher', () => {
    expect(webSite().publisher['@id']).toBe(musicGroup()['@id']);
  });
});

describe('breadcrumbs', () => {
  it('numbers the trail from 1 with absolute links', () => {
    const list = breadcrumbs([
      { name: 'Início', path: '/' },
      { name: 'Palco', path: '/palco' },
    ]);
    expect(list.itemListElement.map((i) => [i.position, i.name, i.item])).toEqual([
      [1, 'Início', `${contact.siteUrl}/`],
      [2, 'Palco', `${contact.siteUrl}/palco`],
    ]);
  });
});

describe('imageGallery', () => {
  it('lists every photograph with its description, and the caption or page only when there is one', () => {
    const gallery = imageGallery({
      name: 'O palco',
      description: 'Fotos',
      path: '/palco',
      images: [
        { src: '/images/a.jpeg', alt: 'A', caption: 'Legenda', path: '/palco/foto/a' },
        { src: '/images/b.jpeg', alt: 'B' },
      ],
    });
    expect(gallery.image).toHaveLength(2);
    expect(gallery.image[0]).toMatchObject({
      contentUrl: `${contact.siteUrl}/images/a.jpeg`,
      description: 'A',
      caption: 'Legenda',
      url: `${contact.siteUrl}/palco/foto/a`,
    });
    expect(gallery.image[1]).not.toHaveProperty('caption');
    expect(gallery.image[1]).not.toHaveProperty('url');
  });

  it('lists a whole gallery set, each photograph with the address of its own page', () => {
    const images = galleryImages(gallery.palco);
    expect(images).toHaveLength(gallery.palco.items.length);
    const first = gallery.palco.items[0];
    expect(images[0]).toEqual({ src: first.src, alt: first.alt, caption: first.caption, path: `/palco/foto/${first.id}` });
    expect(galleryImages(gallery.arquivo)[0].path).toMatch(/^\/arquivo\/cartaz\//);
  });
});

describe('videoObject', () => {
  it('gives the duration in ISO 8601 and absolute URLs', () => {
    const clip = videoObject({
      title: 'Solo',
      description: 'Guitarra',
      sources: [
        { src: '/video/solo.av1.mp4', type: 'video/mp4; codecs="av01.0.08M.08"' },
        { src: '/video/solo.mp4', type: 'video/mp4; codecs="avc1.640028"' },
      ],
      poster: '/video/solo.jpg',
      duration: 83.4,
      uploaded: '2026-10-06',
    });
    expect(clip.duration).toBe('PT1M23S');
    expect(clip.contentUrl).toBe(`${contact.siteUrl}/video/solo.mp4`);
    expect(clip.thumbnailUrl).toBe(`${contact.siteUrl}/video/solo.jpg`);
  });

  it('describes every clip the site plays, naming the file every browser can open', () => {
    for (const video of videos) {
      const object = videoObject(video);
      expect(object.name).toBe(video.title);
      expect(object.contentUrl).toBe(`${contact.siteUrl}/video/${video.id}.mp4`);
      expect(object.duration).toMatch(/^PT\d+S$/);
    }
  });

  it('writes whole minutes, bare seconds and zero', () => {
    expect(isoDuration(120)).toBe('PT2M');
    expect(isoDuration(24.6)).toBe('PT25S');
    expect(isoDuration(0)).toBe('PT0S');
  });
});

describe('serialise', () => {
  it('cannot be made to close its own script element', () => {
    const out = serialise({ name: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('<');
    expect(JSON.parse(out).name).toBe('</script><script>alert(1)</script>');
  });
});
