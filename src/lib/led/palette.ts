// src/lib/led/palette.ts
// The colours a LED canvas paints with, read from the design tokens on the
// element itself. Shared by LedPanel and LedMarquee so the two signs can never
// disagree on a colour, and so a token the parser does not understand can only
// ever fall back — never throw inside a render effect.
import { mix, parseColor } from '@/design/color';

/** Hex fallbacks, close to `--color-led-500` and `--color-led-900`. */
export const FALLBACK_LED = '#4fa3ff';
export const FALLBACK_DIM = '#17304f';

/**
 * Reads a colour custom property as the browser computed it and returns it
 * as-is when the colour helpers can parse it (a hex or oklch() token), or the
 * fallback otherwise. The raw token is returned, not a conversion: `mix()`
 * parses the same syntaxes, and an rgba() string would not survive it.
 */
export function readColorVar(el: Element, name: string, fallback: string): string {
  let raw = '';
  try {
    raw = getComputedStyle(el).getPropertyValue(name).trim();
  } catch {
    return fallback;
  }
  if (!raw) return fallback;
  try {
    parseColor(raw);
    return raw;
  } catch {
    return fallback;
  }
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
