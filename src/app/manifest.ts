import type { MetadataRoute } from 'next';
import { toHex } from '@/design/color';
import { tokens } from '@/design/tokens';
import { system } from '@/data/copy/system';

// What a phone shows when the site is added to the home screen. It opens in
// the browser (`display: 'browser'`): this is a site, not an app, and it has
// no offline mode to promise.
export default function manifest(): MetadataRoute.Manifest {
  const night = toHex(tokens.palette['night-950']);
  return {
    name: system.manifest.name,
    short_name: system.manifest.shortName,
    description: system.manifest.description,
    lang: 'pt-BR',
    start_url: '/',
    display: 'browser',
    background_color: night,
    theme_color: night,
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  };
}
