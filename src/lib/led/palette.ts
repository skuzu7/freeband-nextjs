// src/lib/led/palette.ts
// The colours a LED canvas paints with, read from the design tokens on the
// element itself. Shared by LedPanel and LedMarquee so the two signs can never
// disagree on a colour, and so a token the parser does not understand can only
// ever fall back — never throw inside a render effect.
//
// The tokens are written as oklch() in tokens.css, but the production
// stylesheet does not ship them that way: Lightning CSS emits a hex fallback
// plus a lab() form for modern browsers, and getComputedStyle hands back
// whichever the browser chose. The colour helpers read hex, oklch() and
// rgb(); anything else is resolved by painting it on a 1×1 canvas and reading
// the pixel back, which turns any syntax the browser accepts into rgb().
import { mix, parseColor } from '@/design/color';

/** The sRGB of `--color-led-500` and `--color-led-900` (tokens.ts), for when nothing can be read. */
export const FALLBACK_LED = '#02a9f7';
export const FALLBACK_DIM = '#0f2e52';

/** A colour no token is, so an invalid value can be told from a painted one. */
const SENTINEL = '#010203';

let probe: CanvasRenderingContext2D | null = null;

/** rgb(r, g, b) for any colour the browser can paint; null when it cannot, or without a canvas. */
export function resolveColor(raw: string): string | null {
  if (typeof document === 'undefined') return null;
  // Only a real context is kept; a missing one is asked for again next time.
  if (!probe) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    probe = canvas.getContext('2d', { willReadFrequently: true });
  }
  if (!probe) return null;
  const paint = (color: string) => {
    probe!.fillStyle = color;
    probe!.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = probe!.getImageData(0, 0, 1, 1).data;
    return a === 255 ? `rgb(${r}, ${g}, ${b})` : null;
  };
  try {
    const sentinel = paint(SENTINEL);
    const painted = paint(raw);
    // An invalid colour leaves fillStyle untouched, so the sentinel shows.
    return painted && painted !== sentinel ? painted : null;
  } catch {
    return null;
  }
}

/** True when the colour helpers can read the string directly. */
function parseable(color: string): boolean {
  try {
    parseColor(color);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads a colour custom property as the browser computed it and returns it
 * in a form `mix()` accepts, or the fallback when nothing usable can be read.
 */
export function readColorVar(el: Element, name: string, fallback: string): string {
  let raw = '';
  try {
    raw = getComputedStyle(el).getPropertyValue(name).trim();
  } catch {
    return fallback;
  }
  if (!raw) return fallback;
  if (parseable(raw)) return raw;
  return resolveColor(raw) ?? fallback;
}

/**
 * `levels` colours from the switched-off dot to the fully lit one. Any colour
 * the mixer rejects drops the whole ramp to the hex fallbacks, so a bad token
 * dims the sign instead of breaking the page.
 */
export function buildPalette(dim: string, led: string, levels: number): string[] {
  const ramp = (a: string, b: string) => Array.from({ length: levels }, (_, i) => mix(a, b, i / Math.max(1, levels - 1)));
  try {
    return ramp(dim, led);
  } catch {
    return ramp(FALLBACK_DIM, FALLBACK_LED);
  }
}

/** Both token colours of a sign, resolved on `el`. */
export function readLedColors(el: Element): { led: string; dim: string } {
  return {
    led: readColorVar(el, '--color-led', FALLBACK_LED),
    dim: readColorVar(el, '--color-led-dim', FALLBACK_DIM),
  };
}
