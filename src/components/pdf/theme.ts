// src/components/pdf/theme.ts
// The design system as @react-pdf/renderer understands it: hex colours read
// from src/design/tokens.ts (paper theme, plus the night colours for the
// cover), the Outfit family registered from the static TTFs in public/fonts,
// and the base styles every PDF page shares. Client-only: the PDF toolkit
// never enters the SSR module graph (pages import *DownloadButton through a
// dynamic import with ssr: false).
import { Font, StyleSheet } from '@react-pdf/renderer';
import { toHex } from '@/design/color';
import { resolveColor, tokens } from '@/design/tokens';

const paper = (name: string) => toHex(resolveColor(name, 'paper'));
const palette = (name: keyof typeof tokens.palette) => toHex(tokens.palette[name]);

export const pdfColors = {
  // paper
  surface: paper('surface'),
  raise: paper('surface-raise'),
  high: '#ffffff',
  ink: paper('ink'),
  inkMuted: paper('ink-muted'),
  // The paper "line" token is translucent; the PDF has no alpha compositing
  // worth trusting, so the nearest opaque grey stands in.
  line: palette('paper-200'),
  led: paper('led'),
  ledBright: palette('led-500'),
  ledDim: palette('led-900'),
  red: paper('red'),
  // night, for the cover
  night: palette('night-950'),
  nightRaise: palette('night-900'),
  inkOnNight: palette('ink-50'),
  inkOnNightMuted: palette('ink-300'),
} as const;

export const PDF_FONT = 'Outfit';

/** A4 in points, and the content width inside the standard 40pt margins. */
export const A4 = { width: 595.28, height: 841.89, margin: 40 } as const;
export const CONTENT_WIDTH = A4.width - A4.margin * 2;

let fontsRegistered = false;

/**
 * Registers the three static Outfit weights. Idempotent. The files live in
 * public/fonts and are fetched from the page's own origin; a caller outside a
 * browser (a Node probe, a test) passes the origin or a file path prefix.
 */
export function registerPdfFonts(prefix = typeof window !== 'undefined' ? window.location.origin : ''): void {
  if (fontsRegistered) return;
  fontsRegistered = true;
  Font.register({
    family: PDF_FONT,
    fonts: [
      { src: `${prefix}/fonts/Outfit-Regular.ttf`, fontWeight: 400 },
      { src: `${prefix}/fonts/Outfit-SemiBold.ttf`, fontWeight: 600 },
      { src: `${prefix}/fonts/Outfit-Bold.ttf`, fontWeight: 700 },
    ],
  });
  // Portuguese words are not to be hyphenated by an English dictionary.
  Font.registerHyphenationCallback((word) => [word]);
}

/** Absolute URL for a public asset, so the browser-side renderer can fetch it. */
export function pdfUrl(path: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${path}`;
}

export const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: pdfColors.surface,
    color: pdfColors.ink,
    fontFamily: PDF_FONT,
    fontSize: 9.5,
    lineHeight: 1.45,
    paddingTop: 44,
    paddingBottom: 60,
    paddingHorizontal: A4.margin,
  },
  label: {
    fontSize: 7.5,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: pdfColors.led,
  },
  labelMuted: {
    fontSize: 7.5,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: pdfColors.inkMuted,
  },
  h1: {
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: -0.7,
    lineHeight: 1.05,
    color: pdfColors.ink,
  },
  h2: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: -0.2,
    color: pdfColors.ink,
  },
  lead: {
    fontSize: 11,
    lineHeight: 1.45,
    color: pdfColors.inkMuted,
  },
  body: {
    fontSize: 9.5,
    lineHeight: 1.55,
    color: pdfColors.inkMuted,
  },
  caption: {
    fontSize: 7,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: pdfColors.inkMuted,
  },
  card: {
    backgroundColor: pdfColors.raise,
    borderWidth: 0.75,
    borderColor: pdfColors.line,
    padding: 12,
  },
  footer: {
    position: 'absolute',
    left: A4.margin,
    right: A4.margin,
    bottom: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.75,
    borderTopColor: pdfColors.line,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: pdfColors.inkMuted,
  },
});
