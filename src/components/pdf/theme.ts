'use client';

// Client-only, like everything under src/components/pdf/: importing this
// from a Server Component is a build error, which is the point — the PDF
// toolkit must never enter the server module graph.
// src/components/pdf/theme.ts
// The design system as @react-pdf/renderer understands it: the three themes of
// src/design/tokens.ts converted to hex (paper for the pages that are read,
// night for the pages that are looked at, sepia for the 1969 chapter), the
// Outfit family registered from the static TTFs in public/fonts, and the type
// styles every PDF page shares. Client-only: the PDF toolkit never enters the
// SSR module graph (pages import *DownloadButton through a dynamic import with
// ssr: false).
import { Font, StyleSheet } from '@react-pdf/renderer';
import { toHex } from '@/design/color';
import { resolveColor, tokens, type PaletteName } from '@/design/tokens';

type ThemeName = Parameters<typeof resolveColor>[1];

const palette = (name: PaletteName) => toHex(tokens.palette[name]);

/**
 * One theme as the PDF needs it. Only the semantic pairs the contrast test
 * proves are used as type: `ink`, `inkMuted` and `ledText` on `surface`,
 * `raise` and `high`; `onRed` on `red`. `led`, `ledHot` and `ledDim` are dots.
 */
function tone(theme: ThemeName, line: PaletteName) {
  const c = (name: string) => toHex(resolveColor(name, theme));
  return {
    surface: c('surface'),
    raise: c('surface-raise'),
    high: c('surface-high'),
    ink: c('ink'),
    inkMuted: c('ink-muted'),
    // The "line" tokens are translucent and the PDF draws no alpha (a
    // transparency group is the first thing an old RIP gets wrong), so the
    // nearest opaque step of the same ramp stands in.
    line: palette(line),
    /** LED blue as type. */
    ledText: c('led-text'),
    /** A lit dot. */
    led: c('led'),
    /** A dot driven hard. */
    ledHot: c('led-hot'),
    /** An unlit dot. */
    ledDim: c('led-dim'),
    red: c('red'),
    onRed: c('on-red'),
  };
}

export type PdfToneColors = ReturnType<typeof tone>;

export const pdfTones = {
  paper: tone('paper', 'paper-200'),
  night: tone('dark', 'night-800'),
  sepia: tone('sepia', 'sepia-800'),
} as const;

export type PdfTone = keyof typeof pdfTones;

/**
 * What a page is printed on. Paper pages are white, not the editor's tinted
 * `surface`: a tint over a whole A4 is toner on every sheet and a grey dither
 * on a mono laser. Night pages are the panel switched off.
 */
export const pdfGround = {
  paper: pdfTones.paper.high,
  night: pdfTones.night.surface,
} as const;

/** The tones a whole page can be set on. */
export type PdfPageTone = keyof typeof pdfGround;

/** What the wall and the acrylic are made of, whatever the page around them. */
export const pdfLed = {
  /** The panel, from an unlit dot to one driven hard. */
  ramp: [palette('led-900'), palette('led-700'), palette('led-500'), palette('led-300'), palette('led-200')],
  /** The acrylic: its face and the extruded side under it. */
  acrylic: palette('red-500'),
  acrylicSide: palette('red-900'),
} as const;

export const PDF_FONT = 'Outfit';

/** A4 in points, and the content width inside the standard 40pt margins. */
export const A4 = { width: 595.28, height: 841.89, margin: 40 } as const;
export const CONTENT_WIDTH = A4.width - A4.margin * 2;

/** Pitch of every dotted rule and rail, in points (the site's --dot-pitch). */
export const DOT_PITCH = 6;

let fontsRegistered = false;

// Read at call time, never hoisted to a module constant: a caller outside a
// browser may define `window` only after this module is imported.
const pageOrigin = () => (typeof window !== 'undefined' ? window.location.origin : '');

/**
 * Registers the three static Outfit weights. Idempotent. The files live in
 * public/fonts and are fetched from the page's own origin; a caller outside a
 * browser (a Node probe, a test) passes the origin or a file path prefix.
 */
export function registerPdfFonts(prefix = pageOrigin()): void {
  if (fontsRegistered) return;
  Font.register({
    family: PDF_FONT,
    // Only these three weights exist: a style asking for another one is a
    // bug, not a fallback. 500 is not among them — use 400 or 600.
    fonts: [
      { src: `${prefix}/fonts/Outfit-Regular.ttf`, fontWeight: 400 },
      { src: `${prefix}/fonts/Outfit-SemiBold.ttf`, fontWeight: 600 },
      { src: `${prefix}/fonts/Outfit-Bold.ttf`, fontWeight: 700 },
    ],
  });
  // Portuguese words are not to be hyphenated by an English dictionary.
  Font.registerHyphenationCallback((word) => [word]);
  // Only once the registration went through: a failed one may be retried.
  fontsRegistered = true;
}

// Null on the site: only a render outside a browser sets it.
let assetBase: string | null = null;

/**
 * Points `pdfUrl` at the public assets when the PDF is rendered outside a
 * browser: a Node test passes the `file://` URL of `public`, and react-pdf
 * reads the photographs from disk. `null` goes back to the page's own origin,
 * which is all the site ever uses.
 */
export function setPdfAssetBase(base: string | null): void {
  assetBase = base;
}

/** Absolute URL for a public asset, so the renderer can fetch it. */
export function pdfUrl(path: string): string {
  return `${assetBase ?? pageOrigin()}${path}`;
}

/**
 * The type styles of one theme. Sizes are shared; only the colours move. The
 * small caps styles set their own line height too: left to the page's fixed
 * 13.8pt box, a caption that wraps opens up wider than the photograph it is
 * under.
 */
function typeStyles(t: PdfToneColors) {
  return StyleSheet.create({
    label: {
      fontSize: 7.5,
      fontWeight: 600,
      letterSpacing: 1.5,
      lineHeight: 1.4,
      textTransform: 'uppercase',
      color: t.ledText,
    },
    labelMuted: {
      fontSize: 7.5,
      fontWeight: 400,
      letterSpacing: 1.5,
      lineHeight: 1.4,
      textTransform: 'uppercase',
      color: t.inkMuted,
    },
    h1: {
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: -0.7,
      lineHeight: 1.05,
      color: t.ink,
    },
    h2: {
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: -0.2,
      color: t.ink,
    },
    lead: {
      fontSize: 11,
      lineHeight: 1.45,
      color: t.inkMuted,
    },
    body: {
      fontSize: 9.5,
      lineHeight: 1.55,
      color: t.inkMuted,
    },
    caption: {
      fontSize: 7,
      letterSpacing: 1.2,
      lineHeight: 1.4,
      textTransform: 'uppercase',
      color: t.inkMuted,
    },
  });
}

/** Type styles per theme: `pdfType.night.h1`, `pdfType.paper.body`… */
export const pdfType = {
  paper: typeStyles(pdfTones.paper),
  night: typeStyles(pdfTones.night),
  sepia: typeStyles(pdfTones.sepia),
} as const;

export const pdfStyles = StyleSheet.create({
  // The box every page starts from. react-pdf hands this font size × line
  // height down as a fixed 13.8pt line box: anything set larger carries its
  // own lineHeight (pdf/__tests__/lineHeight.test.ts).
  page: {
    fontFamily: PDF_FONT,
    fontSize: 9.5,
    lineHeight: 1.45,
    paddingTop: 44,
    paddingBottom: 60,
    paddingHorizontal: A4.margin,
  },
  footer: {
    position: 'absolute',
    left: A4.margin,
    right: A4.margin,
    bottom: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
